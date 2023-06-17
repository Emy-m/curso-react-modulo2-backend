const path = require("path");
const fs = require("fs");
const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
const port = 3000;
const multer = require("multer");

const imagesFolder = path.join(__dirname, "images");
const defaultImage = path.join(imagesFolder, "terminator.png");

/*
 * Delete all images except for terminator.png at the beginning
 * Throws an error if the images folder or terminator.png file doesn't exist
 */
if (fs.existsSync(imagesFolder)) {
  fs.readdir(imagesFolder, (err, files) => {
    if (err) {
      console.error("Error reading folder:", err);
      return;
    }

    files.forEach((file) => {
      if (file !== "terminator.png") {
        fs.unlink(path.join(imagesFolder, file), (err) => {
          if (err) {
            console.error("Error deleting file:", err);
            return;
          }
        });
      }
    });
  });
}

const movies = [
  {
    id: 1,
    title: "The Terminator",
    genre: "Action",
    year: 1984,
    image: "terminator.png",
  },
];

const handleError = (err, res) => {
  res.status(500).contentType("application/json").json({
    message: "Oops! Something went wrong!",
    error: err,
  });
};

/* Cannot delete default image */
const deleteImage = (path) => {
  if (path === defaultImage) {
    return;
  }
  fs.unlink(path, (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
};

const deleteMovie = (movie) => {
  if (movie.id === 1) {
    return;
  }

  movies.splice(movies.indexOf(movie), 1);
};

const upload = multer({
  dest: imagesFolder,
});

/* Methods */

app.get("/movies", (req, res) => {
  res.json(movies);
});

app.get("/movies/:id", (req, res) => {
  let movie = movies.find((m) => m.id === parseInt(req.params.id));
  res.json(movie ? [movie] : []);
});

app.use("/images", express.static(imagesFolder));

app.post("/movies", upload.single("image"), (req, res) => {
  const { title, genre, year } = req.body;
  const image = req.file;

  try {
    /* Check movie props */
    if (!title) {
      throw "Please provide title";
    }
    if (!genre) {
      throw "Please provide genre";
    }
    if (!year) {
      throw "Please provide year";
    }
    if (!image) {
      throw "Please provide a image";
    }

    /* Check image type and save */
    if (path.extname(image.originalname).toLowerCase() === ".png") {
      fs.rename(
        image.path,
        __dirname + "/images/" + image.originalname,
        (err) => {
          if (err) {
            deleteImage(image.path);
            throw err;
          }
        }
      );
    } else {
      throw "Invalid image type";
    }

    /* Add movie to array */
    movies.push({
      id: movies.length + 1,
      title: title,
      genre: genre,
      year: year,
      image: image.originalname,
    });
    res.status(200).contentType("application/json").json({
      message: "Movie uploaded successfully",
    });
  } catch (err) {
    if (image) {
      deleteImage(image.path);
    }
    handleError(err, res);
  }
});

app.delete("/movies/:id", (req, res) => {
  try {
    const movie = movies.find((m) => m.id === parseInt(req.params.id));
    if (!movie) {
      throw "Movie not found";
    }

    /* Delete image */
    deleteImage(path.join(imagesFolder, movie.image));

    /* Delete movie */
    deleteMovie(movie);
    res.status(200).contentType("application/json").json({
      message: "Movie deleted successfully",
    });
  } catch (err) {
    handleError(err, res);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
