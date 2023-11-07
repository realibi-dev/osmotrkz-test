export default function Button({type, text, onClick, additionalStyles}) {
    const filledStyles = {
        backgroundColor: '#04cf91',
        color: '#fff',
        fontSize: 16,
    }

    const textStyles = {
        color: '#09C18A',
        textAlign: 'center',
        fontSize: 14,
        backgroundColor: 'transparent',
    }

    return (
        <button
            style={{
                width: '100%',
                height: 40,
                borderRadius: 30,
                border: 'none',
                cursor: 'pointer',
                ...(type === 'filled' && filledStyles),
                ...(type === 'text' && textStyles),
                ...additionalStyles,
            }}
            onClick={onClick}
        >
            {text}
        </button>
    );
}