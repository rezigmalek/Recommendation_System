from flask import Flask, request, jsonify
import pandas as pd
import joblib
from sklearn.preprocessing import LabelEncoder
from flask_cors import CORS
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# =====================================================
# LOAD MODEL
# =====================================================

model = joblib.load("xgb_recommender.pkl")

# =====================================================
# FEATURES
# =====================================================

CLIENT_FEAT_COLS = [
    "Pasivity_O",
    "is_active",
    "AVG_TRAF_OUT_VOICE_ONNET",
    "AVG_TRAF_OUT_VOICE_OFFNET",
    "AVG_TRAF_OUT_VOICE_INTER",
    "AVG_TRAF_TOTAL",
    "AVG_VOLUME_DATA_MO",
    "TRAF_ONNET_RATIO",
    "TRAF_OFFNET_RATIO",
    "AVG_REAL_REV",
    "Potential_Max_REV",
    "Tenure",
    "rev_trend",
    "rev_growth_rate",
    "rev_volatility",
    "data_trend_mb",
    "data_voice_ratio",
    "Value_Segment_enc"
]

OFFER_FEAT_COLS = [
    "price",
    "data general",
    "onnet_voice_unlimited",
    "offnet_voice_unlimited",
    "credit_international",
    "credit_offnet",
    "credit_onnet",
]

# =====================================================
# FEATURE ENGINEERING
# =====================================================

def build_client_features(client_dict):
    """
    Prend un dict client (venant du JSON),
    retourne un dict enrichi avec les features calculées.
    """
    df = pd.DataFrame([client_dict])

    # --- Revenue features ---
    rev_cols = [f"REV_M{i}" for i in range(1, 7)]
    if all(col in df.columns for col in rev_cols):
        df["rev_trend"]       = (df["REV_M1"] - df["REV_M6"]) / (df["REV_M6"] + 1)
        df["rev_growth_rate"] = (df["REV_M1"] - df["REV_M6"]) / (df["REV_M6"] + 1e-6)
        df["rev_volatility"]  = df[rev_cols].std(axis=1) / (df[rev_cols].mean(axis=1) + 1)
    else:
        df["rev_trend"] = df["rev_growth_rate"] = df["rev_volatility"] = 0

    # --- Data trend ---
    data_cols = [f"VOLUME_DATA_MO_M{i}" for i in range(1, 7)]
    if all(col in df.columns for col in data_cols):
        df["data_trend_mb"] = (df["VOLUME_DATA_MO_M1"] - df["VOLUME_DATA_MO_M6"]) / (df["VOLUME_DATA_MO_M6"] + 1)
    else:
        df["data_trend_mb"] = 0

    # --- Data / Voice ratio ---
    voice_cols = [f"Sum_TRAF_OUT_M{i}" for i in range(1, 7)]
    if all(col in df.columns for col in data_cols + voice_cols):
        avg_data  = df[data_cols].mean(axis=1)
        avg_voice = df[voice_cols].mean(axis=1)
        df["data_voice_ratio"] = avg_data / (avg_voice + 1)
    else:
        df["data_voice_ratio"] = 0

    # --- Value Segment encoding ---
    le = LabelEncoder()
    df["Value_Segment_enc"] = le.fit_transform(df["Value_Segment"].fillna("Unknown"))

    df = df.fillna(0)

    return df.iloc[0].to_dict()


# =====================================================
# PREDICTION
# =====================================================

def predict_for_client(client_dict, offers_list):
    """
    Calcule les scores pour toutes les offres pour un client donné.
    Retourne une liste triée [{ Offer_Code, score }, ...]
    """
    client_enriched = build_client_features(client_dict)

    feature_names = CLIENT_FEAT_COLS + OFFER_FEAT_COLS + [
        "price_ratio_to_max",
        "data_match",
        "offnet_match",
        "onnet_match"
    ]

    rows = []
    offer_codes = []

    for offer in offers_list:

        price_ratio_to_max = offer["price"] / (client_enriched.get("Potential_Max_REV", 0) + 1)

        data_match = offer["data general"] / (client_enriched.get("AVG_VOLUME_DATA_MO", 0) / 1024 + 0.01)

        offnet_match = (client_enriched.get("TRAF_OFFNET_RATIO", 0) > 0.4) * offer["offnet_voice_unlimited"]

        onnet_match  = (client_enriched.get("TRAF_ONNET_RATIO", 0) > 0.5) * offer["onnet_voice_unlimited"]

        row = (
            [client_enriched.get(col, 0) for col in CLIENT_FEAT_COLS]
            + [offer.get(col, 0) for col in OFFER_FEAT_COLS]
            + [price_ratio_to_max, data_match, offnet_match, onnet_match]
        )

        rows.append(row)
        offer_codes.append(offer["Offer_Code"])

    X = pd.DataFrame(rows, columns=feature_names)
    scores = model.predict_proba(X)[:, 1]

    results = [
        {"Offer_Code": offer_codes[i], "score": round(float(scores[i]), 6)}
        for i in range(len(offer_codes))
    ]

    results.sort(key=lambda x: x["score"], reverse=True)
    return results


# =====================================================
# API
# =====================================================

@app.route("/api/recommend", methods=["POST"])
def recommend():
    try:
        body   = request.get_json(force=True)
        client = body.get("client")
        offers = body.get("offers")

        if not client:
            return jsonify({"error": "client is required"}), 400
        if not offers:
            return jsonify({"error": "offers is required"}), 400

        recommendations = predict_for_client(client, offers)

        return jsonify({
            "recommendations":      recommendations,
            "total_offers_ranked":  len(recommendations)
        })

    except Exception as e:
        logger.exception("Erreur dans /api/recommend")
        return jsonify({"error": str(e)}), 500


# =====================================================
# HEALTH CHECK
# =====================================================

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "UP"})


# =====================================================
# MAIN
# =====================================================

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)