"use client";

import React, { useState, useEffect } from "react";
import styles from "./reservation.module.css";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import Calendar from "./Calendar";

export default function Reservation() {
  const [astrologues, setAstrologues] = useState([]);
  const [selectedAstrologue, setSelectedAstrologue] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [minDate, setMinDate] = useState(new Date());
  const [tooltipMessage, setTooltipMessage] = useState("");

  useEffect(() => {
    const fetchAstrologues = async () => {
      try {
        const response = await fetch("/api/astrologues", { method: "GET" });
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des astrologues");
        }
        const data = await response.json();
        console.log("Données astrologues:", data);
        setAstrologues(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des astrologues:", error);
        setError("Erreur lors de la récupération des astrologues.");
      } finally {
        setLoading(false);
      }
    };

    fetchAstrologues();

    const today = new Date();
    today.setDate(today.getDate() + 2); // Initialiser minDate par défaut
    setMinDate(today);
  }, []);

  const handleAstrologueSelect = (astrologue) => {
    console.log("Astrologue sélectionné:", astrologue);

    const uniqueServices = Array.from(
      new Set(astrologue.services.map((service) => service.id))
    ).map((id) => astrologue.services.find((service) => service.id === id));

    setSelectedAstrologue({
      ...astrologue,
      services: uniqueServices,
       // unavailable_dates: Array.from(new Set(astrologue.unavailable_dates)), // Commenté car la table unavailable_dates n'existe pas actuellement
      availabilities: Array.from(new Set(astrologue.availabilities)),
    });
    setSelectedService(null);

    const newMinDate = new Date();
    newMinDate.setDate(newMinDate.getDate() + astrologue.notice_delay);
    setMinDate(newMinDate);

    findNextAvailability(astrologue);
  };

  const findNextAvailability = (astrologue, startDate = new Date()) => {
    if (isNaN(startDate.getTime())) {
      startDate = new Date();
    }

    let currentDate = new Date(Math.max(new Date(), startDate));
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 2); // Limite de 2 mois à l'avance

    let attempts = 0;
    const maxAttempts = 1000; // Limite de sécurité pour éviter les boucles infinies

    while (attempts < maxAttempts) {
      if (currentDate > maxDate) {
        console.log("Aucune disponibilité trouvée avant la limite de 2 mois.");
        return;
      }

      attempts++;
      const dayOfWeek = currentDate.toLocaleDateString("en-US", { weekday: "long" });
      const availability = astrologue.availabilities.find((av) => av.day === dayOfWeek);

      if (availability && availability.slots.length > 0) {
        const slots = availability.slots.split(","); // Assuming slots are stored as comma-separated values
        for (const slot of slots) {
          const [start, end] = slot.split("-");
          const slotTime = new Date(currentDate);
          const [hours, minutes] = start.split(":").map(Number);
          slotTime.setHours(hours, minutes, 0, 0);

          if (slotTime > new Date()) {
            setSelectedDate(currentDate);
            setSelectedTime(start);
            console.log("Créneau disponible trouvé:", slotTime);
            return;
          }
        }
      }

      currentDate.setDate(currentDate.getDate() + 1);
      console.log("Pas de créneau disponible, prochaine date vérifiée:", currentDate);
    }

    console.error("Aucune disponibilité trouvée après", maxAttempts, "tentatives.");
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
    console.log("Service sélectionné:", e.target.value);
    setSelectedService(e.target.value);
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

    // Logic to handle the reservation
  };

  const renderTimeSlots = () => {
    if (!selectedAstrologue || !selectedDate) return null;

    const dayOfWeek = selectedDate.toLocaleDateString("en-US", { weekday: "long" });
    const availability = selectedAstrologue.availabilities.find((av) => av.day === dayOfWeek);

    if (!availability) return <div>Aucun créneau disponible pour ce jour.</div>;

    const timeSlots = [...new Set(availability.slots.split(","))];

    console.log("Créneaux horaires disponibles pour", dayOfWeek, ":", timeSlots);

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

  const handleDateSelect = (date) => {
    console.log("Date sélectionnée:", date);
    console.log("Date minimale:", minDate);
    setSelectedDate(date);
    setSelectedTime(null);

    const today = new Date();
    const maxDate = new Date();
    maxDate.setMonth(today.getMonth() + 2); // Limite de 2 mois à l'avance

    if (date < minDate) {
      console.log("Date sélectionnée est en dessous du délai de prévenance.");
      setTooltipMessage("Cette date est en dessous du délai de prévenance.");
      console.log("Tooltip message mis à jour:", "Cette date est en dessous du délai de prévenance.");
    } else if (date > maxDate) {
      console.log("Date sélectionnée est au-delà de la limite de 2 mois.");
      setTooltipMessage("Cette date est au-delà de la limite de 2 mois.");
      console.log("Tooltip message mis à jour:", "Cette date est au-delà de la limite de 2 mois.");
    } else {
      console.log("Date sélectionnée est acceptable.");
      setTooltipMessage("");
      console.log("Tooltip message mis à jour:", "");
    }

    console.log("Tooltip message actuel:", tooltipMessage); // Ajout de ce log
  };

  const renderTooltip = () => {
    console.log("Rendering tooltip with message:", tooltipMessage);
    if (tooltipMessage) {
      return (
        <div className={styles.tooltip}>
          {tooltipMessage}
        </div>
      );
    }
    return null;
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
          service: selectedAstrologue.services.find((s) => s.id === parseInt(selectedService)).name,
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
    <PayPalScriptProvider options={{ "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID }}>
      <div className={styles.container}>
        <h1 className={styles.title}>KintuniAI - Réservation et Paiement</h1>
        <form onSubmit={handleSubmit}>
          <div className={styles.reservationGrid}>
            <div className={styles.leftColumn}>
              <div className={styles.section}>
                <h2>Choisissez votre astrologue</h2>
                <div className={styles.astrologueList}>
                  {Array.isArray(astrologues) && astrologues.map((astrologue, index) => (
                    <div
                      key={`${astrologue.id}-${index}`}
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
                    {[...new Set(selectedAstrologue.services.map((service, index) => (
                      <option key={`${selectedAstrologue.id}-${service.id}-${index}`} value={service.id}>
                        {service.name} - {service.price}€ ({service.duration} min)
                      </option>
                    )))]}
                  </select>
                </div>
              )}
            </div>
  
            <div className={styles.rightColumn}>
              {selectedAstrologue && (
                <div className={styles.section}>
                  <h2>Sélectionnez une date et une heure</h2>
                  <Calendar
                    onSelectDate={handleDateSelect}
                    selectedDate={selectedDate}
                    unavailableDates={[]} // Enlever la référence à selectedAstrologue.unavailable_dates
                    minDate={minDate}
                  />
                  {renderTooltip()}
                  {selectedDate && renderTimeSlots()}
                  <button
                    type="button"
                    className={styles.nextAvailabilityButton}
                    onClick={handleNextAvailability}
                  >
                    Prochaine disponibilité
                  </button>
                </div>
              )}
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
                        (s) => s.id === parseInt(selectedService)
                      ).price
                    }
                    €
                  </p>
                  <div className={styles.paypalButtonContainer}>
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
                      className={styles.paypalButton}
                    />
                  </div>
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
