import Response from "../models/Response.js";
export const detectFakeNews = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Text is required",
      });
    }

    const mlResponse = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    const mlData = await mlResponse.json();

    if (!mlResponse.ok) {
      return res.status(mlResponse.status).json({
        success: false,
        message: "ML service failed to analyze news",
        error: mlData,
      });
    }

    const savedResponse = await Response.create({
      user: req.userId,
      text,
      verdict: mlData.verdict,
      confidence: mlData.confidence,
      real_probability: mlData.real_probability,
      fake_probability: mlData.fake_probability,
    });

    return res.status(200).json({
      success: true,
      data: {
        ...mlData,
        _id: savedResponse._id,
        text: savedResponse.text,
        createdAt: savedResponse.createdAt,
      },
    });
  } catch (error) {
    console.error("ML Service Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to analyze news",
      error: error.message,
    });
  }
};
