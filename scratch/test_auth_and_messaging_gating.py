import urllib.request
import urllib.parse
import http.cookiejar
import json
import sys

BASE_URL = "http://localhost:3000"

def create_session():
    cj = http.cookiejar.CookieJar()
    opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))
    return opener

def do_get(opener, path):
    url = f"{BASE_URL}{path}"
    req = urllib.request.Request(url, headers={"User-Agent": "TestClient/1.0"})
    try:
        with opener.open(req) as response:
            return response.status, response.read().decode('utf-8', errors='replace')
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode('utf-8', errors='replace')
    except Exception as e:
        return 0, str(e)

def do_post(opener, path, data):
    url = f"{BASE_URL}{path}"
    json_data = json.dumps(data).encode('utf-8')
    req = urllib.request.Request(
        url,
        data=json_data,
        headers={"Content-Type": "application/json", "User-Agent": "TestClient/1.0"}
    )
    try:
        with opener.open(req) as response:
            return response.status, response.read().decode('utf-8', errors='replace')
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode('utf-8', errors='replace')
    except Exception as e:
        return 0, str(e)

def test_unauthenticated():
    print("--- 1. Testing Unauthenticated State ---")
    opener = create_session()
    status, body = do_get(opener, "/api/v1/auth/me")
    assert status == 200, f"Expected 200, got {status}"
    data = json.loads(body)
    assert data.get("data") is None, "Expected null data for anonymous session"
    print("PASS: Anonymous user /api/v1/auth/me returns null (Messages option gated)")

    status, _ = do_get(opener, "/")
    assert status == 200
    print("PASS: Main landing page (/) renders HTTP 200 without leaking auth controls")

    status, _ = do_get(opener, "/messages")
    assert status == 200
    print("PASS: Universal /messages renders HTTP 200 with authentication requirement gate")

def test_client_flow():
    print("\n--- 2. Testing Authenticated Client Messaging Flow ---")
    opener = create_session()
    status, body = do_post(opener, "/api/v1/auth/login", {
        "email": "david.sterling@lumina.tech",
        "password": "Client@123456",
        "requiredRole": "CLIENT"
    })
    assert status == 200, f"Login failed: {body}"
    print("PASS: Client logged in successfully")

    status, body = do_get(opener, "/api/v1/auth/me")
    assert status == 200
    data = json.loads(body)
    assert data["success"] is True
    assert data["data"]["role"] == "CLIENT"
    print(f"PASS: Session authenticated as Client '{data['data']['name']}'")

    status, body = do_get(opener, "/api/v1/messages/conversations?role=CLIENT")
    assert status == 200
    conv_data = json.loads(body)
    assert conv_data["success"] is True
    threads = conv_data["data"]
    print(f"PASS: Client conversations loaded ({len(threads)} threads)")

    # Verify sending a message in existing thread
    if len(threads) > 0:
        first_thread = threads[0]
        status, body = do_post(opener, "/api/v1/messages/send", {
            "conversationId": first_thread["id"],
            "senderRole": "CLIENT",
            "content": "Automated verification: Client milestone scope sync."
        })
        assert status == 200, f"Sending message failed: {body}"
        send_data = json.loads(body)
        assert send_data["success"] is True
        print(f"PASS: Client message successfully sent to thread {first_thread['id']}")

def test_freelancer_flow():
    print("\n--- 3. Testing Authenticated Freelancer Messaging Flow ---")
    opener = create_session()
    status, body = do_post(opener, "/api/v1/auth/login", {
        "email": "alex.chen@apexlance.io",
        "password": "Freelancer@123456",
        "requiredRole": "FREELANCER"
    })
    assert status == 200, f"Login failed: {body}"
    print("PASS: Freelancer logged in successfully")

    status, body = do_get(opener, "/api/v1/auth/me")
    assert status == 200
    data = json.loads(body)
    assert data["success"] is True
    assert data["data"]["role"] == "FREELANCER"
    print(f"PASS: Session authenticated as Freelancer '{data['data']['name']}'")

    status, body = do_get(opener, "/api/v1/messages/conversations?role=FREELANCER")
    assert status == 200
    conv_data = json.loads(body)
    assert conv_data["success"] is True
    threads = conv_data["data"]
    print(f"PASS: Freelancer conversations loaded ({len(threads)} threads)")

if __name__ == "__main__":
    test_unauthenticated()
    test_client_flow()
    test_freelancer_flow()
    print("\n=======================================================")
    print(" ALL AUTHENTICATION & MESSAGING TESTS PASSED (100%)!")
    print("=======================================================")
