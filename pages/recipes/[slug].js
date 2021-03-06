import Image from "next/image";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { contentful } from "../../external/contentful/contentful";
import Skeleton from "../../components/Skeleton";

export const getStaticPaths = async () => {
  const res = await contentful.getEntries({ content_type: "recipe" });
  const paths = res.items.map((item) => {
    return {
      params: {
        slug: item.fields.slug,
      },
    };
  });
  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps = async (context) => {
  const { params } = context;
  const { items } = await contentful.getEntries({
    content_type: "recipe",
    "fields.slug": params.slug,
  });
  if (items.length === 0)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  return {
    props: {
      recipe: items[0],
    },
    revalidate: 1,
  };
};

export default function RecipeDetails(props) {
  if (!props.recipe) return <Skeleton />;
  const { featuredImage, title, cookingTime, ingredients, method } =
    props.recipe.fields;
  return (
    <div>
      <div className="banner">
        <Image
          src={"https:" + featuredImage.fields.file.url}
          width={featuredImage.fields.file.details.image.width}
          height={featuredImage.fields.file.details.image.height}
        />
        <h2>{title}</h2>
      </div>

      <div className="info">
        <p>Takes about {cookingTime} mins to cook.</p>
        <h3>Ingredients:</h3>

        {ingredients.map((ing) => (
          <span key={ing}>{ing}</span>
        ))}
      </div>

      <div className="method">
        <h3>Method:</h3>
        <div>{documentToReactComponents(method)}</div>
      </div>

      <style jsx>{`
        h2,
        h3 {
          text-transform: uppercase;
        }
        .banner h2 {
          margin: 0;
          background: #fff;
          display: inline-block;
          padding: 20px;
          position: relative;
          top: -60px;
          left: -10px;
          transform: rotateZ(-1deg);
          box-shadow: 1px 3px 5px rgba(0, 0, 0, 0.1);
        }
        .info p {
          margin: 0;
        }
        .info span::after {
          content: ", ";
        }
        .info span:last-child::after {
          content: ".";
        }
      `}</style>
    </div>
  );
}
