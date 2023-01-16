import { GetServerSideProps } from "next";
import clientPromise from "../lib/mongodb";
import { Movie } from "../types/movies";

export default function Movies({ movies }: { movies: Movie[] }) {
  return (
    <div>
      <h1> Top 20 Movies of All Times</h1>
      <p>
        <small> (According to Metacritic) </small>
      </p>
      <ul>
        {movies.map((movie) => (
          <li>
            <h2> {movie.title}</h2>
            <h2> {movie.metacritic}</h2>
            <p> {movie.plot}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const getServerSideProps = async () => {
  try {
    const client = await clientPromise;
    const db = client.db("sample_mflix");

    const movies = await db
      .collection("movies")
      .find({})
      .sort({ metacritic: -1 })
      .limit(20)
      .toArray();

    return {
      props: { movies: JSON.parse(JSON.stringify(movies)) },
    };
  } catch (e) {
    return { movies: null };
  }
};
