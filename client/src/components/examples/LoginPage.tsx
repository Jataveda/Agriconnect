import LoginPage from "../LoginPage";

export default function LoginPageExample() {
  return <LoginPage onLogin={(type, id) => console.log(`Logged in as ${type}:`, id)} />;
}
