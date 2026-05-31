from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
import pickle
import os
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger(__name__)

app = Flask(__name__)

MODEL_PATH   = os.getenv("MODEL_PATH",   "models/xgb_offer_model.pkl")
COLUMNS_PATH = os.getenv("COLUMNS_PATH", "models/model_columns.pkl")

# =========================
# Load model
# =========================

with open(MODEL_PATH, "rb") as f:
    MODEL = pickle.load(f)

with open(COLUMNS_PATH, "rb") as f:
    MODEL_COLUMNS = pickle.load(f)

logger.info(f"Modele charge — {len(MODEL_COLUMNS)} features attendues")


# =========================
# FEATURE ENGINEERING
# =========================

def build_features(client, offers):

    client_df = pd.DataFrame([client])
    offers_df = pd.DataFrame(offers)   # 🔥 OFFERS NOW JSON

    inactive = client_df["Flag_Activity"].isnull().all()

    client_df["is_inactive"] = int(inactive)
    client_df["Flag_Activity"] = client_df["Flag_Activity"].fillna("Inactive")

    if "Pasivity_O" not in client_df.columns:
        client_df["Pasivity_O"] = 0.0

    client_df["Pasivity_O"] = client_df["Pasivity_O"].fillna(
        1.0 if inactive else 0.0
    )

    # =========================
    # fill missing numeric client fields
    # =========================

    client_df = client_df.fillna(0)

    # =========================
    # CARTESIAN PRODUCT (CLIENT x OFFERS)
    # =========================

    client_df["_key"] = 1
    offers_df["_key"] = 1

    long_df = client_df.merge(offers_df, on="_key").drop(columns="_key")

    # =========================
    # FEATURE ENGINEERING
    # =========================

    long_df["prix_vs_revenu_ratio"] = (
        long_df["price"] / (long_df.get("AVG_REAL_REV", 1) + 1)
    )

    long_df["prix_rank"] = long_df["price"].rank(pct=True)

    long_df["match_inter"] = (
        long_df.get("AVG_TRAF_OUT_VOICE_INTER", 0) *
        long_df.get("credit_international", 0)
    )

    long_df["match_onnet"] = (
        long_df.get("TRAF_ONNET_RATIO", 0) *
        long_df.get("onnet_voice_unlimited", 0)
    )

    long_df["match_data"] = (
        long_df.get("AVG_VOLUME_DATA_MO", 0) *
        long_df.get("data general", 0)
    )

    long_df["data_per_revenue"] = (
        long_df.get("AVG_VOLUME_DATA_MO", 0) /
        (long_df.get("AVG_REAL_REV", 1) + 1)
    )

    long_df["voice_fit_score"] = (
        long_df.get("AVG_TRAF_TOTAL", 0) /
        (
            long_df.get("onnet_voice_unlimited", 0) +
            long_df.get("offnet_voice_unlimited", 0) + 1
        )
    )

    # =========================
    # ALIGN MODEL INPUT
    # =========================

    long_df = long_df.reindex(columns=MODEL_COLUMNS, fill_value=0)

    return long_df


# =========================
# PREDICT
# =========================

def predict_all_offers(client, offers):

    X = build_features(client, offers)

    scores = MODEL.predict_proba(X)[:, 1]

    offers_df = pd.DataFrame(offers)

    offers_df["score"] = scores

    offers_df = offers_df.sort_values("score", ascending=False)

    return offers_df.to_dict(orient="records")


# =========================
# API
# =========================

@app.route("/api/recommend", methods=["POST"])
def recommend():

    try:
        body = request.get_json(force=True)

        subs_id = body.get("subs_id")
        client = body.get("client")
        offers = body.get("offers")   # 🔥 OFFERS AS JSON

        if not client or not offers:
            return jsonify({"error": "client and offers are required"}), 400

        recommendations = predict_all_offers(client, offers)

        return jsonify({
            "subs_id": subs_id,
            "total_offers_ranked": len(recommendations),
            "recommendations": recommendations
        })

    except Exception as e:
        logger.exception("Erreur /api/recommend")
        return jsonify({"error": str(e)}), 500


# =========================
# RUN
# =========================

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)