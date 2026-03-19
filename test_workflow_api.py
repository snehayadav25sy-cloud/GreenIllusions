import requests
import json

def test_api():
    url = "http://127.0.0.1:8000/analyze"
    payload = {
        "esg_text": "We reduced carbon emissions by 20% compared to 2020 baseline.",
        "provider": "aws"
    }
    
    try:
        print(f"🚀 Sending request to {url}...")
        response = requests.post(url, json=payload)
        response.raise_for_status()
        data = response.json()
        
        print(f"\n✅ Analysis Complete! Processed {data.get('total_claims_analyzed')} claim(s).")
        
        for item in data.get("results", []):
            analysis = item['analysis']
            print(f"\n📝 Claim: {item['claim']}")
            print(f"⚖️ Verdict: {analysis['final_verdict']}")
            print(f"🛡️ Compliance: {analysis.get('compliance_check', {}).get('compliance_status')}")
            print(f"🧠 Explanation: {analysis['explanation']}")
            print(f"📊 Trust Score: {int(analysis.get('confidence', 0) * 100)}%")
            
            citations = analysis.get('citations', [])
            if citations:
                print(f"📚 Citations: {len(citations)} source(s)")
                for cite in citations:
                    print(f"   - {cite['source']} (Page {cite['page']})")
                    
            trace = analysis.get('trace', [])
            if trace:
                 print(f"👣 Trace: {' -> '.join(trace)}")
            
    except Exception as e:
        print(f"❌ API Request Failed: {e}")

if __name__ == "__main__":
    test_api()
