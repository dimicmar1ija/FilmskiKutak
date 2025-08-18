import CategoryList from "../components/tags/CategoryList";
import CategoryCreateForm from "../components/tags/CategoryCreateForm";

export default function AdminCategories() {
  return (
    <div className="space-y-4">
      <h2>Tagovi (Kategorije)</h2>
      <CategoryCreateForm onCreated={() => window.location.reload()} />
      <CategoryList />
    </div>
  );
}
