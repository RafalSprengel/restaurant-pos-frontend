import "./ErrorMessage.scss";


export default function MessageError({ message }) {

    return (
        <div className="errorMessage">
            <span className="errorMessage__icon">❌</span>{message}
        </div>
    );
}