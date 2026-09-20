<!DOCTYPE html>
<html>
<head>
    <title>Invitation to join Walletry</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-w-xl mx-auto p-4">
        <h2 style="color: #FF5722;">Hello!</h2>
        
        <p><strong>{{ $inviterName }}</strong> has added you as a <strong>{{ $partnerType }}</strong> in their Walletry business directory.</p>
        
        <p>To securely chat with them, share documents, and track your mutual transactions in real-time, please register or log in to Walletry.</p>
        
        <div style="margin: 30px 0;">
            <a href="{{ url('/register') }}" style="background-color: #FF5722; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                Join Walletry to Chat
            </a>
        </div>
        
        <p style="font-size: 0.9em; color: #666;">
            If you already have a Walletry account with this email address, simply <a href="{{ url('/login') }}">log in here</a>.
        </p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="font-size: 0.8em; color: #999;">
            Powered by Walletry - Smart Finance & Invoicing
        </p>
    </div>
</body>
</html>
