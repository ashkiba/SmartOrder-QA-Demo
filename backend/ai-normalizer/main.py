from fastapi import FastAPI, Request

app = FastAPI()

@app.post("/normalize")
async def normalize_address(req: Request):
    body = await req.json()
    address = body.get("address", {})
    normalized = {
        "street": address.get("street", "").title(),
        "city": address.get("city", "").title(),
        "region": "Standardized",
        "country": address.get("country", "").upper()
    }
    return normalized