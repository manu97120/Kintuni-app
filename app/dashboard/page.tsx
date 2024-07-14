// app/dashboard/page.tsx
"use client";

import React from "react";
import styles from "./dashboard.module.css";
import Profile from "./Profile";

export default function Dashboard() {
  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <i className="fas fa-star"></i>
          KintuniAI
        </div>
        <nav>
          <ul className={styles.sidebarMenu}>
            <li>
              <a href="/dashboard#clients">
                <i className="fas fa-users"></i>Clientèle
              </a>
            </li>
            <li>
              <a href="/dashboard#messagerie">
                <i className="fas fa-envelope"></i>Messagerie
              </a>
            </li>
            <li>
              <a href="/dashboard#finance">
                <i className="fas fa-chart-line"></i>Suivi Financier
              </a>
            </li>
            <li>
              <a href="/dashboard#profil" className={styles.active}>
                <i className="fas fa-user"></i>Profil
              </a>
            </li>
          </ul>
        </nav>
      </aside>
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h1>Paramètres du Profil</h1>
        </header>
        <Profile />
      </main>
    </div>
  );
}
