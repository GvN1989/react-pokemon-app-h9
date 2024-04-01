import './Button.css';

function Button ({type, children, onClick, disabled=false}) {

    return (

        <button type={type} disabled={disabled} onClick={onClick}>
            {children}
        </button>

    )

}

export default Button;