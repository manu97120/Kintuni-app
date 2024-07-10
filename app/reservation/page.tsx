"use client";

import React, { useState, useEffect } from "react";
import styles from "./reservation.module.css";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import Calendar from "./Calendar";

// Données mockées
const MOCK_ASTROLOGUES = [
  {
    id: 1,
    name: "Nova Étoile",
    avatar: "https://example.com/nova.jpg",
    description:
      "Expert en lecture de Natal Chart avec plus de 10 ans d'expérience. Spécialiste des thèmes complexes et des aspects rares.",
    services: [
      { id: 1, name: "Lecture de Natal Chart", price: 150, duration: 60 },
      { id: 2, name: "Analyse Karmique", price: 200, duration: 90 },
    ],
    unavailableDates: ["2024-07-15", "2024-07-16", "2024-07-17"],
    noticeDelay: 2,
  },
  {
    id: 2,
    name: "Céleste Lumière",
    avatar: "https://example.com/celeste.jpg",
    description:
      "Spécialiste en astrologie karmique et prévisions à long terme. Experte en synastrie et compatibilité amoureuse.",
    services: [
      { id: 3, name: "Prévisions Annuelles", price: 180, duration: 75 },
      { id: 4, name: "Analyse des Transits", price: 160, duration: 60 },
    ],
    unavailableDates: ["2024-07-20", "2024-07-21", "2024-07-22"],
    noticeDelay: 7,
  },
];

export default function Reservation() {
  const [astrologues, setAstrologues] = useState(MOCK_ASTROLOGUES);
  const [selectedAstrologue, setSelectedAstrologue] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [minDate, setMinDate] = useState(new Date());

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setAstrologues(MOCK_ASTROLOGUES);
      setLoading(false);
    }, 1000);

    const today = new Date();
    today.setDate(today.getDate() + 2); // Délai de prévenance par défaut
    setMinDate(today);
  }, []);

  const handleAstrologueSelect = (astrologue) => {
    setSelectedAstrologue(astrologue);
    setSelectedService(null);

    const newMinDate = new Date();
    newMinDate.setDate(newMinDate.getDate() + astrologue.noticeDelay);
    setMinDate(newMinDate);

    findNextAvailability(astrologue);
  };

  const findNextAvailability = (astrologue, startDate = new Date()) => {
    let currentDate = new Date(Math.max(startDate, minDate));
    while (true) {
      if (
        !astrologue.unavailableDates.includes(
          currentDate.toISOString().split("T")[0],
        )
      ) {
        setSelectedDate(currentDate);
        setSelectedTime("09:00"); // Premier créneau disponible
        break;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
  };

  const handleNextAvailability = () => {
    if (selectedAstrologue) {
      const startDate = selectedDate
        ? new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000)
        : new Date();
      findNextAvailability(selectedAstrologue, startDate);
    } else {
      alert("Veuillez d'abord sélectionner un astrologue");
    }
  };

  const handleServiceSelect = (e) => {
    setSelectedService(e.target.value);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !selectedAstrologue ||
      !selectedService ||
      !selectedDate ||
      !selectedTime ||
      !clientName ||
      !clientEmail
    ) {
      alert("Veuillez remplir tous les champs");
      return;
    }
    console.log("Réservation soumise", {
      selectedAstrologue,
      selectedService,
      selectedDate,
      selectedTime,
      clientName,
      clientEmail,
    });
  };

  const renderTimeSlots = () => {
    const timeSlots = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];
    return (
      <div className={styles.timeSlots}>
        {timeSlots.map((time) => (
          <button
            key={time}
            className={`${styles.timeSlot} ${selectedTime === time ? styles.selected : ""}`}
            onClick={() => handleTimeSelect(time)}
          >
            {time}
          </button>
        ))}
      </div>
    );
  };

  const sendConfirmationEmail = async (details) => {
    try {
      const response = await fetch("/api/send-confirmation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: clientName,
          email: clientEmail,
          astrologue: selectedAstrologue.name,
          service: selectedAstrologue.services.find(
            (s) => s.id === parseInt(selectedService),
          ).name,
          date: selectedDate,
          time: selectedTime,
          orderId: details.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send confirmation email");
      }

      console.log("Confirmation email sent successfully");
    } catch (error) {
      console.error("Error sending confirmation email:", error);
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <PayPalScriptProvider
      options={{ "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID }}
    >
      <div className={styles.container}>
        <h1 className={styles.title}>KintuniAI - Réservation et Paiement</h1>
        <form onSubmit={handleSubmit}>
          <div className={styles.reservationGrid}>
            <div className={styles.leftColumn}>
              <div className={styles.section}>
                <h2>Choisissez votre astrologue</h2>
                <div className={styles.astrologueList}>
                  {astrologues.map((astrologue) => (
                    <div
                      key={astrologue.id}
                      className={`${styles.astrologueCard} ${selectedAstrologue === astrologue ? styles.selected : ""}`}
                      onClick={() => handleAstrologueSelect(astrologue)}
                    >
                      <img
                        src={astrologue.avatar}
                        alt={astrologue.name}
                        className={styles.astrologueAvatar}
                      />
                      <h3>{astrologue.name}</h3>
                      <div className={styles.astrologueDescription}>
                        <div className={styles.descriptionContent}>
                          {astrologue.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedAstrologue && (
                <div className={styles.section}>
                  <h2>Sélectionnez un service</h2>
                  <select
                    value={selectedService || ""}
                    onChange={handleServiceSelect}
                    className={styles.select}
                  >
                    <option value="">Choisissez un service</option>
                    {selectedAstrologue.services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name} - {service.price}€ ({service.duration}{" "}
                        min)
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className={styles.rightColumn}>
              <div className={styles.section}>
                <h2>Sélectionnez une date et une heure</h2>
                <Calendar
                  onSelectDate={handleDateSelect}
                  selectedDate={selectedDate}
                  unavailableDates={
                    selectedAstrologue
                      ? selectedAstrologue.unavailableDates
                      : []
                  }
                  minDate={minDate}
                />
                {selectedDate && renderTimeSlots()}
                <button
                  type="button"
                  className={styles.nextAvailabilityButton}
                  onClick={handleNextAvailability}
                >
                  Prochaine disponibilité
                </button>
              </div>
            </div>
          </div>

          <div className={styles.bottomSection}>
            <div className={styles.section}>
              <h2>Vos informations</h2>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Votre nom"
                required
                className={styles.input}
              />
              <input
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="Votre email"
                required
                className={styles.input}
              />
            </div>

            {selectedAstrologue &&
              selectedService &&
              selectedDate &&
              selectedTime && (
                <div className={styles.section}>
                  <h2>Paiement</h2>
                  <p className={styles.totalPrice}>
                    Total à payer :{" "}
                    {
                      selectedAstrologue.services.find(
                        (s) => s.id === parseInt(selectedService),
                      ).price
                    }
                    €
                  </p>
                  <PayPalButtons
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        purchase_units: [
                          {
                            amount: {
                              value: selectedAstrologue.services
                                .find((s) => s.id === parseInt(selectedService))
                                .price.toString(),
                            },
                          },
                        ],
                      });
                    }}
                    onApprove={(data, actions) => {
                      return actions.order.capture().then((details) => {
                        console.log("Paiement approuvé", details);
                        sendConfirmationEmail(details);
                        // Redirection vers la page de confirmation
                        window.location.href = "/confirmation";
                      });
                    }}
                  />
                </div>
              )}

            <button type="submit" className={styles.submitButton}>
              <img
                src="/paypal-icon.png"
                alt="PayPal"
                className={styles.paypalIcon}
              />
              Confirmer et Payer
            </button>
          </div>
        </form>
      </div>
    </PayPalScriptProvider>
  );
}
