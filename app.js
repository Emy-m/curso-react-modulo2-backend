const path = require("path");
const fs = require("fs");
const express = require("express");
const app = express();
const cors = require("cors");
const port = 3000;
const multer = require("multer");

app.use(cors());
app.use(express.json());

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

const genres = ["Action", "Comedy", "Drama", "Fantasy", "Horror", "Romance"];

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
/* Movies */

app.get("/movies", (req, res) => {
  res.json(movies);
});

app.get("/search/:filter", (req, res) => {
  const filter = req.params.filter.toLowerCase();
  const regExp = new RegExp(`\\b${filter}\\b`, "i");
  const filteredMovies = movies.filter((movie) => regExp.test(movie.title));
  res.json(filteredMovies);
});

app.get("/movies/:id", (req, res) => {
  try {
    let movie = movies.find((m) => m.id === parseInt(req.params.id));
    if (movie) res.json([movie]);
    else throw "Movie not found";
  } catch (err) {
    handleError(err, res);
  }
});

app.post("/movies", (req, res) => {
  const { title, genre, year, image } = req.body;

  try {
    /* Check movie props */
    if (!title) {
      throw "Please provide title";
    }
    if (!genre || !genres.includes(genre)) {
      throw "Please provide genre";
    }
    if (!year) {
      throw "Please provide year";
    }
    if (!image) {
      throw "Please provide a image";
    }

    /* Add movie to array */
    movies.push({
      id: movies.length + 1,
      title: title,
      genre: genre,
      year: year,
      image: image,
    });
    res.status(200).contentType("application/json").json({
      message: "Movie uploaded successfully",
    });
  } catch (err) {
    if (image) {
      deleteImage(path.join(imagesFolder, image));
    }
    handleError(err, res);
  }
});

app.patch("/movies/:id", (req, res) => {
  const { title, genre, year, image } = req.body;

  try {
    const movie = movies.find((m) => m.id === parseInt(req.params.id));
    if (!movie) {
      throw "Movie not found";
    }
    if (genre && !genres.includes(genre)) {
      throw "Please provide a valid genre";
    }

    /* Update movie only if isn't undefined */
    movie.title = title ? title : movie.title;
    movie.genre = genre ? genre : movie.genre;
    movie.year = year ? year : movie.year;
    movie.image = image ? image : movie.image;

    res.status(200).contentType("application/json").json({
      message: "Movie updated successfully",
    });
  } catch (err) {
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
    /* It does not consider if another movie uses this image */
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

/* Images */

app.use("/images", express.static(imagesFolder));

app.post("/images", upload.single("image"), (req, res) => {
  const image = req.file;
  if (!image) {
    return res.status(400).json({ error: "Please provide a file to upload" });
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

  res.status(200).json({ imageName: image.originalname });
});

/* Genres */

app.get("/genres", (req, res) => {
  res.json(genres);
});

/* Start server */

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
