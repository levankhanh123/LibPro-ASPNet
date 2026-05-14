export default function LoginPage() {
    return (
        <div className="login-container">
            <h2>Login</h2>
            <form className="login-form">
                <input type="text" placeholder="Username" />
                <input type="password" placeholder="Password" />
                <button className="login-button">Login</button>
            </form>
        </div>
    );
}
