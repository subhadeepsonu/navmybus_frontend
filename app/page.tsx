import LoginForm from "@/components/forms/login_form";


export default function Home() {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="w-80 h-1/2 border-2 shadow-sm rounded-sm">
        <LoginForm />
      </div>
    </div>
  );
}
