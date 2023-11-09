import styles from './style.module.css';

export default function Widget({ heading, text }) {
    return (
        <div className={styles.container}>
            <div className={styles.icon} style={{ backgroundImage: 'url(/tick.png)' }}></div>
            <p className={styles.heading}>{heading}</p>
            <p className={styles.text}>{text}</p>
        </div>
    );
}