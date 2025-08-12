import { Button } from "@/components/ui/button";

const Home = () => {
  return (
    <div>
      <div className="flex justify-end items-center p-5">
        <Button variant={"destructive"}>Logout</Button>
      </div>
    </div>
  );
};

export default Home;
