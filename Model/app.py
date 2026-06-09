from flask import Flask, request, jsonify
import pandas as pd
import pickle
import os
import logging
from flask_cors import CORS
CORS

# =========================
# Ancien model
# =========================

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger(__name__)

app = Flask(__name__)

MODEL_PATH   = os.getenv("MODEL_PATH",   "models/xgb_offer_model.pkl")
COLUMNS_PATH = os.getenv("COLUMNS_PATH", "models/model_columns.pkl")

# =========================
# LOAD MODEL
# =========================

with open(MODEL_PATH, "rb") as f:
    MODEL = pickle.load(f)

with open(COLUMNS_PATH, "rb") as f:
    MODEL_COLUMNS = pickle.load(f)

logger.info(f"Model loaded - {len(MODEL_COLUMNS)} features")

# =========================
# CHAMPS INFORMATIFS (exclus du modèle, retournés dans la réponse)
# =========================

# Ces colonnes sont des métadonnées — elles ne doivent PAS entrer dans les features
# du modèle, mais doivent être restituées dans la réponse finale.

CLIENT_INFO_FIELDS = [
    "Subs_Id",
    "Client_name",
    "Contact"
    "Client_past_offer_reference",
    "Client_past_offer_name",
    "Client_past_offer_price",
]

OFFER_INFO_FIELDS = [
    "Offer_ID",
    "Offer_name",
    "price",
    "data general",
    "onnet_voice_unlimited",
    "offnet_voice_unlimited",
    "credit_international",
    "credit_offnet",
    "credit_onnet",
]

# =========================
# FEATURE ENGINEERING
# =========================

def build_features(client, offers):

    client_df = pd.DataFrame([client])
    offers_df = pd.DataFrame(offers)

    # =========================
    # CLIENT CLEANING
    # =========================

    inactive = client_df["Flag_Activity"].isnull().all()

    client_df["is_inactive"] = int(inactive)
    client_df["Flag_Activity"] = client_df["Flag_Activity"].fillna("Inactive")

    if "Pasivity_O" not in client_df.columns:
        client_df["Pasivity_O"] = 0.0

    client_df["Pasivity_O"] = client_df["Pasivity_O"].fillna(
        1.0 if inactive else 0.0
    )

    client_df = client_df.fillna(0)

    # =========================
    # CARTESIAN PRODUCT
    # =========================

    client_df["_key"] = 1
    offers_df["_key"] = 1

    long_df = client_df.merge(offers_df, on="_key").drop(columns="_key")

    # =========================
    # FEATURE ENGINEERING
    # =========================

    long_df["prix_vs_revenu_ratio"] = long_df["price"] / (long_df.get("AVG_REAL_REV", 1) + 1)

    long_df["prix_rank"] = long_df["price"].rank(pct=True)

    long_df["match_inter"] = (
        long_df.get("AVG_TRAF_OUT_VOICE_INTER", 0)
        * long_df.get("credit_international", 0)
    )

    long_df["match_onnet"] = (
        long_df.get("TRAF_ONNET_RATIO", 0)
        * long_df.get("onnet_voice_unlimited", 0)
    )

    long_df["match_data"] = (
        long_df.get("AVG_VOLUME_DATA_MO", 0)
        * long_df.get("data general", 0)
    )

    long_df["data_per_revenue"] = (
        long_df.get("AVG_VOLUME_DATA_MO", 0)
        / (long_df.get("AVG_REAL_REV", 1) + 1)
    )

    long_df["voice_fit_score"] = (
        long_df.get("AVG_TRAF_TOTAL", 0)
        / (
            long_df.get("onnet_voice_unlimited", 0)
            + long_df.get("offnet_voice_unlimited", 0)
            + 1
        )
    )

    long_df = long_df.fillna(0)

    X = long_df.reindex(columns=MODEL_COLUMNS, fill_value=0)

    return X


# =========================
# PREDICTION
# =========================

def predict_all_offers(client, offers):

    X = build_features(client, offers)

    scores = MODEL.predict_proba(X)[:, 1]

    # Reconstruire les offres avec TOUTES leurs informations
    offers_df = pd.DataFrame(offers).copy().fillna(0)
    offers_df["score"] = scores
    offers_df = offers_df.sort_values(by="score", ascending=False)

    return offers_df.to_dict(orient="records")


# =========================
# API
# =========================

@app.route("/api/recommend", methods=["POST"])
def recommend():

    try:
        body = request.get_json(force=True)

        client = body.get("client")
        offers = body.get("offers")

        if not client:
            return jsonify({"error": "client is required"}), 400

        if not offers:
            return jsonify({"error": "offers is required"}), 400

        recommendations = predict_all_offers(client, offers)

        # Extraire les infos client à retourner dans la réponse
        client_info = {field: client.get(field) for field in CLIENT_INFO_FIELDS}

        # Chaque recommandation contient déjà tous les champs de l'offre
        # (Offer_ID, Offer_name, price, data general, ...) + le score
        enriched_recommendations = []
        for rec in recommendations:
            enriched_rec = {field: rec.get(field) for field in OFFER_INFO_FIELDS}
            enriched_rec["score"] = rec.get("score")
            enriched_recommendations.append(enriched_rec)

        return jsonify({
            "client":          client_info,
            "recommendations": enriched_recommendations,
            "total_offers_ranked": len(enriched_recommendations),
        })

    except Exception as e:
        logger.exception("Error in recommendation API")
        return jsonify({"error": str(e)}), 500


# =========================
# HEALTH CHECK
# =========================

@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "UP",
        "features": len(MODEL_COLUMNS)
    })


# =========================
# RUN
# =========================

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)