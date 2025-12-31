import express from "express";
import { protectRoute } from "./middleware/protectRoute.js";
import cookieParser from "cookie-parser";
import path from "path";





import authRoutes from "./routes/auth.route.js";
import movieRoutes from "./routes/movie.route.js";
import tvRoutes from "./routes/tv.route.js";
import searchRoutes from "./routes/search.route.js";
import { ENV_VARS } from "./config/envVars.js";
import { connectDB } from "./config/db.js";


const app = express();
const PORT = ENV_VARS.PORT;
const __dirname = path.resolve();
app.use(express.json());
app.use(cookieParser());



app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/movie",protectRoute,movieRoutes);
app.use("/api/v1/tv",protectRoute, tvRoutes);
app.use("/api/v1/search",protectRoute, searchRoutes);



if (ENV_VARS.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.get(/.*/, (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}


app.listen(PORT, ()=>{
    console.log("Server is running on port " + PORT);
    connectDB();
})

















// Before
// res.status(200).json({success:true, data:response.results});

// After (all three functions: searchPerson, searchMovie, searchTvShow)
// res.status(200).json({ success: true, content: response.results });



// Before (wrong)
// title: response.results.title

// After (correct)
// title: response.results[0].title

// console.log("Error in searchMovie controller", error.message);
// same for searchTvShow and searchPerson


// Before (wrong)
// router.get("/history/:id", removeItemFromSearchHistory);



// After (correct)
// router.delete("/history/:id", protectRoute, removeItemFromSearchHistory);

// Now correctly maps tab to actual backend routes
// const endpoints = {
//   person: `/api/v1/search/person/${searchTerm}`,
//   movie:  `/api/v1/search/movie/${searchTerm}`,
//   tv:     `/api/v1/search/tv/${searchTerm}`
// };
// axios.get(endpoints[activeTab])

// setSearchResults(res.data.content || res.data.data || []);

// {/* <img
//   src={`${SMALL_IMAGE_BASE_URL}${item.poster_path || item.profile_path || ''}`}
//   onError={(e) => e.target.src = "/placeholder.jpg"}  // fallback image
//   className="object-cover rounded"
//   alt={item.title || item.name}
// /> */}