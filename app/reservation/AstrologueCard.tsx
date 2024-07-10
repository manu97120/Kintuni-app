import React from 'react';
import styles from './AstrologueCard.module.css';

const AstrologueCard = ({ astrologue, isSelected, onSelect }) => {
  return (
    <div 
      className={`${styles.astrologueCard} ${isSelected ? styles.selected : ''}`}
      onClick={() => onSelect(astrologue.id)}
    >
      <img src={astrologue.avatar} alt={astrologue.name} className={styles.astrologueAvatar} />
      <h3>{astrologue.name}</h3>
      <div className={styles.astrologueDescription}>
        <p>{astrologue.description}</p>
      </div>
    </div>
  );
};

export default AstrologueCard;