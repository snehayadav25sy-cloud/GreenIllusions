# import streamlit as st
# import requests

# # -------------------- PAGE CONFIG --------------------
# st.set_page_config(
#     page_title="Green Illusions",
#     page_icon="🌱",
#     layout="wide"
# )

# # -------------------- HEADER --------------------
# st.markdown(
#     """
#     <style>
#         .title {
#             font-size: 48px;
#             font-weight: 800;
#             color: #2ecc71;
#         }
#         .subtitle {
#             font-size: 18px;
#             color: #555;
#             margin-bottom: 30px;
#         }
#         .claim-box {
#             padding: 15px;
#             border-radius: 10px;
#             margin-bottom: 15px;
#             background-color: #f9f9f9;
#             border-left: 6px solid #2ecc71;
#         }
#     </style>
#     """,
#     unsafe_allow_html=True
# )

# st.markdown('<div class="title">🌱 Green Illusions</div>', unsafe_allow_html=True)
# st.markdown(
#     '<div class="subtitle">Agentic AI system to detect greenwashing in sustainability claims</div>',
#     unsafe_allow_html=True
# )

# # -------------------- INPUT SECTION --------------------
# with st.container():
#     col1, col2 = st.columns([3, 1])

#     with col1:
#         text = st.text_area(
#             "Paste ESG Report / Sustainability Statement",
#             height=220,
#             placeholder="Example: We reduced carbon emissions by 30% in 2023..."
#         )

#     with col2:
#         provider = st.selectbox(
#             "AI Provider",
#             ["ibm", "aws"]
#         )

#         analyze_btn = st.button("🔍 Analyze Claims", use_container_width=True)

# # -------------------- ANALYSIS --------------------
# if analyze_btn:
#     if not text.strip():
#         st.warning("Please paste some ESG text to analyze.")
#     else:
#         with st.spinner("Running Agentic AI analysis..."):
#             response = requests.post(
#                 "http://127.0.0.1:8000/analyze",
#                 json={
#                     "text": text,
#                     "provider": provider
#                 }
#             )

#             data = response.json()

#         # -------------------- SUMMARY --------------------
#         st.markdown("---")
#         st.success(f"✅ **Claims analyzed:** {data['total_claims_analyzed']}")

#         # -------------------- RESULTS --------------------
#         for idx, item in enumerate(data["results"], start=1):
#             claim = item["claim"]
#             analysis = item["analysis"]

#             verdict = analysis["final_verdict"]
#             risk = analysis["risk_level"]
#             explanation = analysis["explanation"]

#             # Risk color
#             if risk.lower() == "high":
#                 st.error(f"🔴 **High Risk** — {verdict}")
#             elif risk.lower() == "medium":
#                 st.warning(f"🟡 **Medium Risk** — {verdict}")
#             else:
#                 st.success(f"🟢 **Low Risk** — {verdict}")

#             st.markdown(
#                 f"""
#                 <div class="claim-box">
#                     <strong>Claim {idx}:</strong><br>
#                     {claim}
#                 </div>
#                 """,
#                 unsafe_allow_html=True
#             )

#             st.markdown(f"**🧠 Explanation:** {explanation}")
#             st.markdown("---")

# # -------------------- FOOTER --------------------
# st.markdown(
#     """
#     <center>
#         <small>
#         Powered by <b>Agentic AI</b> • RAG-based Evidence Verification • IBM watsonx & AWS Bedrock
#         </small>
#     </center>
#     """,
#     unsafe_allow_html=True
# )

# import streamlit as st
# import requests
# import math

# # ---------------- PAGE CONFIG ----------------
# st.set_page_config(
#     page_title="Green Illusions | ESG Intelligence",
#     page_icon="🌱",
#     layout="wide"
# )

# # ---------------- STYLE ----------------
# st.markdown("""
# <style>
# body {
#     background-color: #f5f7fa;
# }
# .metric-card {
#     background: white;
#     padding: 20px;
#     border-radius: 14px;
#     box-shadow: 0 4px 14px rgba(0,0,0,0.05);
#     text-align: center;
# }
# .metric-title {
#     font-size: 14px;
#     color: #777;
# }
# .metric-value {
#     font-size: 32px;
#     font-weight: 700;
# }
# .badge {
#     display: inline-block;
#     padding: 4px 10px;
#     border-radius: 20px;
#     font-size: 12px;
#     font-weight: 600;
# }
# .low { background:#d4edda; color:#155724; }
# .medium { background:#fff3cd; color:#856404; }
# .high { background:#f8d7da; color:#721c24; }

# .claim-card {
#     background: white;
#     padding: 20px;
#     border-radius: 16px;
#     margin-bottom: 20px;
#     box-shadow: 0 6px 18px rgba(0,0,0,0.06);
# }
# </style>
# """, unsafe_allow_html=True)

# # ---------------- SIDEBAR ----------------
# st.sidebar.markdown("## 🌱 Green Illusions")
# st.sidebar.caption("Agentic AI for ESG Trust")

# provider = st.sidebar.selectbox("AI Provider", ["ibm", "aws"])
# st.sidebar.markdown("---")
# st.sidebar.success("API Status: Online")

# # ---------------- HERO ----------------
# st.markdown("## ESG Greenwashing Intelligence Platform")
# st.caption(
#     "Analyze sustainability claims using **Agentic AI**, RAG-based evidence verification, "
#     "and deception detection."
# )

# # ---------------- INPUT ----------------
# text = st.text_area(
#     "Paste ESG Report / Sustainability Statement",
#     height=200,
#     placeholder="We reduced carbon emissions by 30% in 2023..."
# )

# analyze = st.button("🚀 Run Analysis")

# # ---------------- ANALYSIS ----------------
# if analyze:
#     if not text.strip():
#         st.warning("Please enter ESG content.")
#     else:
#         with st.spinner("Running multi-agent analysis..."):
#             res = requests.post(
#                 "http://127.0.0.1:8000/analyze",
#                 json={"text": text, "provider": provider}
#             ).json()

#         claims = res["results"]
#         total = res["total_claims_analyzed"]

#         high = sum(1 for c in claims if c["analysis"]["risk_level"].lower() == "high")
#         medium = sum(1 for c in claims if c["analysis"]["risk_level"].lower() == "medium")
#         low = sum(1 for c in claims if c["analysis"]["risk_level"].lower() == "low")

#         trust_score = max(0, 100 - (high * 30 + medium * 15))

#         # ---------------- KPI METRICS ----------------
#         col1, col2, col3, col4 = st.columns(4)

#         col1.markdown(
#             f"<div class='metric-card'><div class='metric-title'>Claims</div>"
#             f"<div class='metric-value'>{total}</div></div>",
#             unsafe_allow_html=True
#         )

#         col2.markdown(
#             f"<div class='metric-card'><div class='metric-title'>High Risk</div>"
#             f"<div class='metric-value'>{high}</div></div>",
#             unsafe_allow_html=True
#         )

#         col3.markdown(
#             f"<div class='metric-card'><div class='metric-title'>Trust Score</div>"
#             f"<div class='metric-value'>{trust_score}%</div></div>",
#             unsafe_allow_html=True
#         )

#         col4.markdown(
#             f"<div class='metric-card'><div class='metric-title'>Provider</div>"
#             f"<div class='metric-value'>{provider.upper()}</div></div>",
#             unsafe_allow_html=True
#         )

#         st.markdown("---")

#         # ---------------- CLAIM DETAILS ----------------
#         for i, item in enumerate(claims, start=1):
#             analysis = item["analysis"]
#             risk = analysis["risk_level"].lower()

#             st.markdown(
#                 f"""
#                 <div class="claim-card">
#                     <span class="badge {risk}">{analysis["risk_level"]} Risk</span>
#                     <h4>Claim {i}</h4>
#                     <p><b>{item["claim"]}</b></p>
#                     <p><b>Verdict:</b> {analysis["final_verdict"]}</p>
#                     <p><b>Explanation:</b> {analysis["explanation"]}</p>
#                 </div>
#                 """,
#                 unsafe_allow_html=True
#             )

# # ---------------- FOOTER ----------------
# st.markdown("---")
# st.caption(
#     "Powered by **Agentic AI** • RAG-based ESG Evidence • IBM watsonx & AWS Bedrock"
# )

# import streamlit as st
# import requests

# # -------------------- PAGE CONFIG --------------------
# st.set_page_config(
#     page_title="Green Illusions",
#     page_icon="🌱",
#     layout="wide"
# )

# # -------------------- CUSTOM CSS --------------------
# st.markdown(
#     """
#     <style>
#         .title {
#             font-size: 52px;
#             font-weight: 900;
#             color: #27ae60;
#             text-align: center;
#             margin-bottom: 10px;
#             font-family: 'Segoe UI', sans-serif;
#         }
#         .subtitle {
#             font-size: 20px;
#             color: #444;
#             text-align: center;
#             margin-bottom: 40px;
#             font-family: 'Segoe UI', sans-serif;
#         }
#         .claim-box {
#             padding: 18px;
#             border-radius: 12px;
#             margin-bottom: 20px;
#             background-color: #fdfdfd;
#             border-left: 8px solid #27ae60;
#             box-shadow: 0px 2px 6px rgba(0,0,0,0.05);
#         }
#         .footer {
#             text-align: center;
#             margin-top: 40px;
#             color: #777;
#             font-size: 14px;
#         }
#     </style>
#     """,
#     unsafe_allow_html=True
# )

# # -------------------- HEADER --------------------
# st.markdown('<div class="title">🌱 Green Illusions</div>', unsafe_allow_html=True)
# st.markdown(
#     '<div class="subtitle">Agentic AI system to detect greenwashing in sustainability claims</div>',
#     unsafe_allow_html=True
# )

# # -------------------- INPUT SECTION --------------------
# with st.container():
#     col1, col2 = st.columns([3, 1])

#     with col1:
#         text = st.text_area(
#             "📄 Paste ESG Report / Sustainability Statement",
#             height=220,
#             placeholder="Example: We reduced carbon emissions by 30% in 2023..."
#         )

#     with col2:
#         provider = st.selectbox(
#             "⚙️ AI Provider",
#             ["ibm", "aws"]
#         )
#         analyze_btn = st.button("🔍 Analyze Claims", use_container_width=True)

# # -------------------- ANALYSIS --------------------
# if analyze_btn:
#     if not text.strip():
#         st.warning("⚠️ Please paste some ESG text to analyze.")
#     else:
#         with st.spinner("⏳ Running Agentic AI analysis..."):
#             response = requests.post(
#                 "http://127.0.0.1:8000/analyze",
#                 json={
#                     "esg_text": text,   # ✅ fixed key to match FastAPI
#                     "provider": provider
#                 }
#             )
#             data = response.json()

#         # -------------------- SUMMARY --------------------
#         st.markdown("---")
#         st.success(f"✅ **Claims analyzed:** {data['total_claims_analyzed']}")

#         # -------------------- RESULTS --------------------
#         for idx, item in enumerate(data["results"], start=1):
#             claim = item["claim"]
#             analysis = item["analysis"]

#             verdict = analysis["final_verdict"]
#             risk = analysis["risk_level"]
#             explanation = analysis["evidence_analysis"]["explanation"]

#             # Risk color-coded verdict
#             if risk.lower() == "high":
#                 st.error(f"🔴 **High Risk** — {verdict}")
#             elif risk.lower() == "medium":
#                 st.warning(f"🟡 **Medium Risk** — {verdict}")
#             else:
#                 st.success(f"🟢 **Low Risk** — {verdict}")

#             # Claim box
#             st.markdown(
#                 f"""
#                 <div class="claim-box">
#                     <strong>Claim {idx}:</strong><br>
#                     {claim}
#                 </div>
#                 """,
#                 unsafe_allow_html=True
#             )

#             # Explanation
#             st.markdown(f"**🧠 Explanation:** {explanation}")
#             st.markdown("---")

# # -------------------- FOOTER --------------------
# st.markdown(
#     """
#     <div class="footer">
#         Powered by <b>Agentic AI</b> • RAG-based Evidence Verification • IBM watsonx & AWS Bedrock
#     </div>
#     """,
#     unsafe_allow_html=True
# )

#app.py
import streamlit as st
import requests

# ---------------- PAGE CONFIG ----------------
st.set_page_config(
    page_title="Green Illusions | ESG Intelligence",
    page_icon="🌱",
    layout="wide"
)

# ---------------- STYLE ----------------
st.markdown("""
<style>
body { background-color: #f5f7fa; }
.metric-card {
    background: white; padding: 20px; border-radius: 14px;
    box-shadow: 0 4px 14px rgba(0,0,0,0.05); text-align: center;
}
.metric-title { font-size: 14px; color: #777; }
.metric-value { font-size: 32px; font-weight: 700; }
.badge { display: inline-block; padding: 4px 10px; border-radius: 20px;
         font-size: 12px; font-weight: 600; }
.low { background:#d4edda; color:#155724; }
.medium { background:#fff3cd; color:#856404; }
.high { background:#f8d7da; color:#721c24; }
.claim-card {
    background: white; padding: 20px; border-radius: 16px;
    margin-bottom: 20px; box-shadow: 0 6px 18px rgba(0,0,0,0.06);
}
</style>
""", unsafe_allow_html=True)

# ---------------- SIDEBAR ----------------
st.sidebar.markdown("## 🌱 Green Illusions")
st.sidebar.caption("Agentic AI for ESG Trust")

provider = st.sidebar.selectbox("AI Provider", ["ibm", "aws"])
st.sidebar.markdown("---")
st.sidebar.success("API Status: Online")

# ---------------- HERO ----------------
st.markdown("## ESG Greenwashing Intelligence Platform")
st.caption(
    "Analyze sustainability claims using **Agentic AI**, RAG-based evidence verification, "
    "and deception detection."
)

# ---------------- INPUT ----------------
text = st.text_area(
    "Paste ESG Report / Sustainability Statement",
    height=200,
    placeholder="We reduced carbon emissions by 30% in 2023..."
)

analyze = st.button("🚀 Run Analysis")

# ---------------- ANALYSIS ----------------
if analyze:
    if not text.strip():
        st.warning("Please enter ESG content.")
    else:
        try:
            with st.spinner("Running multi-agent analysis..."):
                res = requests.post(
                    "http://127.0.0.1:8000/analyze",
                    json={"esg_text": text, "provider": provider}   # ✅ corrected key
                ).json()

            claims = res["results"]
            total = res["total_claims_analyzed"]

            high = sum(1 for c in claims if c["analysis"]["risk_level"].lower() == "high")
            medium = sum(1 for c in claims if c["analysis"]["risk_level"].lower() == "medium")
            low = sum(1 for c in claims if c["analysis"]["risk_level"].lower() == "low")

            trust_score = max(0, 100 - (high * 30 + medium * 15))

            # ---------------- KPI METRICS ----------------
            col1, col2, col3, col4 = st.columns(4)
            col1.markdown(f"<div class='metric-card'><div class='metric-title'>Claims</div><div class='metric-value'>{total}</div></div>", unsafe_allow_html=True)
            col2.markdown(f"<div class='metric-card'><div class='metric-title'>High Risk</div><div class='metric-value'>{high}</div></div>", unsafe_allow_html=True)
            col3.markdown(f"<div class='metric-card'><div class='metric-title'>Trust Score</div><div class='metric-value'>{trust_score}%</div></div>", unsafe_allow_html=True)
            col4.markdown(f"<div class='metric-card'><div class='metric-title'>Provider</div><div class='metric-value'>{provider.upper()}</div></div>", unsafe_allow_html=True)

            st.markdown("---")

            # ---------------- CLAIM DETAILS ----------------
            for i, item in enumerate(claims, start=1):
                analysis = item["analysis"]
                risk = analysis["risk_level"].lower()

                st.markdown(
                    f"""
                    <div class="claim-card">
                        <span class="badge {risk}">{analysis["risk_level"]} Risk</span>
                        <h4>Claim {i}</h4>
                        <p><b>{item["claim"]}</b></p>
                        <p><b>Verdict:</b> {analysis["final_verdict"]}</p>
                        <p><b>Explanation:</b> {analysis["evidence_analysis"]["explanation"]}</p>
                    </div>
                    """,
                    unsafe_allow_html=True
                )
        except Exception as e:
            st.error(f"Backend error: {e}")

# ---------------- FOOTER ----------------
st.markdown("---")
st.caption("Powered by **Agentic AI** • RAG-based ESG Evidence • IBM watsonx & AWS Bedrock")
