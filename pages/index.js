import RecipeCard from "../components/RecipeCard";
import { contentful } from "../external/contentful/contentful";

export const getStaticProps = async () => {
  const res = await contentful.getEntries({ content_type: "recipe" });
  return {
    props: {
      recipes: res.items,
    },
  };
};

export default function Recipes(props) {
  const { recipes } = props;
  console.log(recipes[0].fields);
  return (
    <div className="recipe-list">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.sys.id} recipe={recipe} />
      ))}
      <style jsx>{`
        .recipe-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-gap: 20px 60px;
        }
      `}</style>
    </div>
  );
}
