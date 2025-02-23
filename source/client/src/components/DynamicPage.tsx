import { useParams } from "react-router-dom";

function DynamicPage() {
  const { setting } = useParams(); 

  return (
    <div>
      <h1>page {setting}</h1>
    </div>
  );
}

export default DynamicPage;
