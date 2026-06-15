import dns from "node:dns";
import mongoose from "mongoose";

const connectdb = async () => {
    try {
        const dbUrl = process.env.DBURL;

        if (dbUrl.startsWith("mongodb+srv://")) {
            dns.setServers(["8.8.8.8", "1.1.1.1"]);
        }

        await mongoose.connect(dbUrl);
        console.log("Database connected successfully");
    }
    catch (error) {
        
        console.error(error.message);
    }
};

export default connectdb;