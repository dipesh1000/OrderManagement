// Email 

// Notification

// OTP
export const GenerateOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000)
    let expiry = new Date()
    expiry.setTime(new Date().getTime() + (30 * 60 * 1000))
    return {otp, expiry}
}

export const onRequestOTP = async (otp: number, toPhoneNumber: string) => {
    const accountSid = 'AC8551fe731f5c478c08ca0fb1d930f064';
    const authToken = '2b35e50bdb48434248f679983add011e';
    const client = require('twilio')(accountSid, authToken);
    const response = await client.messages.create({
        body: `Your OTP is ${otp}`,
        from: '+18325643304',
        to: `+977${toPhoneNumber}`
    })
}

// Payment Notification or Emails