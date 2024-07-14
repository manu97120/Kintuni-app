// app/dashboard/Profile.tsx
"use client";

import React, { useState, useEffect } from "react";
import styles from "./profile.module.css";

export default function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    avatar: "",
    description: "",
    services: [],
    availabilities: {
      Monday: { isAvailable: true, slots: [{ start: "09:00", end: "17:00" }] },
      Tuesday: { isAvailable: true, slots: [{ start: "09:00", end: "17:00" }] },
      Wednesday: {
        isAvailable: true,
        slots: [{ start: "09:00", end: "17:00" }],
      },
      Thursday: {
        isAvailable: true,
        slots: [{ start: "09:00", end: "17:00" }],
      },
      Friday: { isAvailable: true, slots: [{ start: "09:00", end: "17:00" }] },
      Saturday: { isAvailable: false, slots: [] },
      Sunday: { isAvailable: false, slots: [] },
    },
    socialLinks: [],
    visioLinks: [],
    paymentMethods: [],
    paypalEmail: "",
    promoCodes: [],
    usePlatformLink: false,
    customVisioLink: "",
    noticePeriod: "24",
    customNoticePeriod: "",
  });

  useEffect(() => {
    setTimeout(() => {
      setProfile({
        name: "Nova Étoile",
        avatar: "https://example.com/nova.jpg",
        description:
          "Expert en lecture de Natal Chart avec plus de 10 ans d'expérience.",

        services: [
          { id: 1, name: "Lecture de Natal Chart", price: 150, duration: 60 },
          { id: 2, name: "Analyse Karmique", price: 200, duration: 90 },
        ],
        availabilities: {
          Sunday: { isAvailable: false, slots: [] },
          Monday: {
            isAvailable: true,
            slots: [{ start: "09:00", end: "17:00" }],
          },
          Tuesday: {
            isAvailable: true,
            slots: [{ start: "09:00", end: "17:00" }],
          },
          Wednesday: {
            isAvailable: true,
            slots: [{ start: "09:00", end: "17:00" }],
          },
          Thursday: {
            isAvailable: true,
            slots: [{ start: "09:00", end: "17:00" }],
          },
          Friday: {
            isAvailable: true,
            slots: [{ start: "09:00", end: "17:00" }],
          },
          Saturday: { isAvailable: false, slots: [] },
        },
        socialLinks: [
          {
            platform: "instagram",
            url: "https://www.instagram.com/nova_etoile_astro",
          },
          {
            platform: "facebook",
            url: "https://www.facebook.com/NovaEtoileAstro",
          },
        ],
        visioLinks: [
          { platform: "zoom", email: "nova.etoile@zoom.us" },
          { platform: "meet", email: "nova.etoile@gmail.com" },
        ],
        paymentMethods: ["paypal", "stripe"],
        paypalEmail: "nova.etoile@paypal.com",
        promoCodes: [],
        usePlatformLink: false,
        customVisioLink: "",
        noticePeriod: "24",
        customNoticePeriod: "",
      });
    }, 1000);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleServiceChange = (index, field, value) => {
    setProfile((prev) => {
      const newServices = [...prev.services];
      newServices[index][field] = value;
      return { ...prev, services: newServices };
    });
  };

  const handleDeleteService = (index) => {
    setProfile((prev) => {
      const newServices = [...prev.services];
      newServices.splice(index, 1);
      return { ...prev, services: newServices };
    });
  };

  const handleAddService = () => {
    setProfile((prev) => ({
      ...prev,
      services: [
        ...prev.services,
        { id: Date.now(), name: "", price: 0, duration: 60 },
      ],
    }));
  };

  const handleDayAvailability = (day, isAvailable) => {
    setProfile((prev) => ({
      ...prev,
      availabilities: {
        ...prev.availabilities,
        [day]: {
          isAvailable,
          slots: isAvailable ? [{ start: "09:00", end: "17:00" }] : [],
        },
      },
    }));
  };

  const handleAvailabilityChange = (day, index, field, value) => {
    setProfile((prev) => {
      const newAvailabilities = { ...prev.availabilities };
      newAvailabilities[day].slots[index][field] = value;
      return { ...prev, availabilities: newAvailabilities };
    });
  };

  const handleDeleteAvailability = (day, index) => {
    setProfile((prev) => {
      const newAvailabilities = { ...prev.availabilities };
      newAvailabilities[day].slots.splice(index, 1);
      return { ...prev, availabilities: newAvailabilities };
    });
  };

  const handleAddAvailability = (day) => {
    setProfile((prev) => {
      const newAvailabilities = { ...prev.availabilities };
      newAvailabilities[day].slots.push({ start: "09:00", end: "17:00" });
      return { ...prev, availabilities: newAvailabilities };
    });
  };

  const handlePromoCodeChange = (index, field, value) => {
    setProfile((prev) => {
      const newPromoCodes = [...prev.promoCodes];
      newPromoCodes[index][field] = value;
      return { ...prev, promoCodes: newPromoCodes };
    });
  };

  const handleDeletePromoCode = (index) => {
    setProfile((prev) => {
      const newPromoCodes = [...prev.promoCodes];
      newPromoCodes.splice(index, 1);
      return { ...prev, promoCodes: newPromoCodes };
    });
  };

  const handleAddPromoCode = () => {
    setProfile((prev) => ({
      ...prev,
      promoCodes: [...prev.promoCodes, { code: "", discount: 0 }],
    }));
  };

  const handleDeleteSocialLink = (index) => {
    setProfile((prev) => {
      const newSocialLinks = [...prev.socialLinks];
      newSocialLinks.splice(index, 1);
      return { ...prev, socialLinks: newSocialLinks };
    });
  };

  const handleAddSocialLink = () => {
    setProfile((prev) => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { platform: "", url: "" }],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className={styles.profileForm}>
      {/* Infos Personnelles */}
      <div className={styles.section}>
        <h2>Informations Personnelles</h2>
        <div className={styles.formGroup}>
          <label htmlFor="name">Nom:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={profile.name}
            onChange={handleInputChange}
            placeholder="Entrez votre nom"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="avatar">Avatar:</label>
          <input
            type="file"
            id="avatar"
            name="avatar"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                const reader = new FileReader();
                reader.onload = (event) => {
                  setProfile((prev) => ({
                    ...prev,
                    avatar: event.target.result,
                  }));
                };
                reader.readAsDataURL(e.target.files[0]);
              }
            }}
          />
          {profile.avatar && (
            <img src={profile.avatar} alt="Avatar" className={styles.avatar} />
          )}
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={profile.description}
            onChange={handleInputChange}
            maxLength={150}
            className={styles.descriptionInput}
            rows={5}
            placeholder="Ici la description qui sera visibile par les utilisateurs de l'application"
          />
        </div>
        <br />
        <button
          type="button"
          className={`${styles.saveButton} ${styles.centerButton}`}
        >
          Sauvegarder
        </button>
      </div>
      {/* Services et Tarifs */}
      <div className={styles.section}>
        <h2>Services et Tarifs</h2>
        <table className={styles.serviceTable}>
          <thead>
            <tr>
              <th className={styles.nameCell}>Service</th>
              <th className={styles.priceCell}>Tarif</th>
              <th className={styles.durationCell}>Durée</th>
              <th className={styles.actionCell}></th>
            </tr>
          </thead>
          <tbody>
            {profile.services.map((service, index) => (
              <tr key={service.id}>
                <td className={styles.nameCell}>
                  <input
                    type="text"
                    value={service.name}
                    onChange={(e) =>
                      handleServiceChange(index, "name", e.target.value)
                    }
                    placeholder="Nom du service"
                    className={styles.fullWidthInput}
                  />
                </td>
                <td className={styles.priceCell}>
                  <textarea
                    value={service.price}
                    onChange={(e) =>
                      handleServiceChange(index, "price", e.target.value)
                    }
                    placeholder="Prix"
                    rows={1}
                    className={styles.smallTextarea}
                  />
                </td>
                <td className={styles.durationCell}>
                  <textarea
                    value={service.duration}
                    onChange={(e) =>
                      handleServiceChange(index, "duration", e.target.value)
                    }
                    placeholder="Durée"
                    rows={1}
                    className={styles.smallTextarea}
                  />
                </td>
                <td className={styles.actionCell}>
                  <div className={styles.actionButtons}>
                    <button
                      type="button"
                      onClick={() => handleDeleteService(index)}
                      className={styles.deleteButton}
                    >
                      —
                    </button>
                    {index === profile.services.length - 1 && (
                      <button
                        type="button"
                        onClick={handleAddService}
                        className={styles.addButton}
                      >
                        ✚
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="button" className={styles.saveButton}>
          Sauvegarder
        </button>
      </div>
      {/* Disponibilités */}
      <div className={styles.section}>
        <h2>Disponibilités</h2>
        {Object.entries(profile.availabilities).map(
          ([day, { isAvailable, slots }]) => (
            <div key={day} className={styles.dayRow}>
              <div className={styles.dayInfo}>
                <input
                  type="checkbox"
                  checked={isAvailable}
                  onChange={(e) => handleDayAvailability(day, e.target.checked)}
                  className={styles.dayCheckbox}
                />
                <span className={styles.dayName}>{day}</span>
              </div>
              <div className={styles.dayContent}>
                {isAvailable ? (
                  <div className={styles.slots}>
                    {slots.map((slot, index) => (
                      <div key={index} className={styles.slot}>
                        <input
                          type="time"
                          value={slot.start}
                          onChange={(e) =>
                            handleAvailabilityChange(
                              day,
                              index,
                              "start",
                              e.target.value,
                            )
                          }
                        />
                        <span>-</span>
                        <input
                          type="time"
                          value={slot.end}
                          onChange={(e) =>
                            handleAvailabilityChange(
                              day,
                              index,
                              "end",
                              e.target.value,
                            )
                          }
                        />
                        <div className={styles.slotActions}>
                          <button
                            onClick={() => handleDeleteAvailability(day, index)}
                            className={styles.deleteButton}
                          >
                            —
                          </button>
                          {index === slots.length - 1 && (
                            <button
                              onClick={() => handleAddAvailability(day)}
                              className={styles.addButton}
                            >
                              ✚
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className={styles.unavailable}>Indisponible</span>
                )}
              </div>
            </div>
          ),
        )}
        <div className={styles.noticePeriod}>
          <label htmlFor="noticePeriod">Délai de prévenance :</label>
          <select
            id="noticePeriod"
            value={profile.noticePeriod}
            onChange={(e) =>
              setProfile((prev) => ({ ...prev, noticePeriod: e.target.value }))
            }
          >
            <option value="24">24 heures</option>
            <option value="48">48 heures</option>
            <option value="72">72 heures</option>
            <option value="custom">Personnalisé</option>
          </select>
          {profile.noticePeriod === "custom" && (
            <input
              type="number"
              value={profile.customNoticePeriod}
              onChange={(e) =>
                setProfile((prev) => ({
                  ...prev,
                  customNoticePeriod: e.target.value,
                }))
              }
              placeholder="Heures"
            />
          )}
        </div>
        <button type="button" className={styles.saveButton}>
          Sauvegarder
        </button>
      </div>

      {/* Liens Sociaux */}
      <div className={styles.section}>
        <h2>Liens Sociaux</h2>
        <table className={styles.socialTable}>
          <tbody>
            {profile.socialLinks.map((link, index) => (
              <tr key={index}>
                <td>
                  <select
                    value={link.platform}
                    onChange={(e) => {
                      const newSocialLinks = [...profile.socialLinks];
                      newSocialLinks[index].platform = e.target.value;
                      setProfile((prev) => ({
                        ...prev,
                        socialLinks: newSocialLinks,
                      }));
                    }}
                  >
                    <option value="instagram">Instagram</option>
                    <option value="facebook">Facebook</option>
                    <option value="twitter">X</option>
                    <option value="discord">Discord</option>
                    <option value="website">Website</option>
                    <option value="campus">Campus Kimuntu</option>
                    <option value="youtube">Youtube</option>
                  </select>
                </td>
                <td>
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) => {
                      const newSocialLinks = [...profile.socialLinks];
                      newSocialLinks[index].url = e.target.value;
                      setProfile((prev) => ({
                        ...prev,
                        socialLinks: newSocialLinks,
                      }));
                    }}
                    placeholder="https://..."
                  />
                </td>
                <td>
                  <div className={styles.actionButtons}>
                    <button
                      type="button"
                      onClick={() => handleDeleteSocialLink(index)}
                      className={styles.deleteButton}
                    >
                      —
                    </button>
                    {index === profile.socialLinks.length - 1 && (
                      <button
                        type="button"
                        onClick={handleAddSocialLink}
                        className={styles.addButton}
                      >
                        ✚
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="button" className={styles.saveButton}>
          Sauvegarder
        </button>
      </div>

      {/* Codes Promo */}
      <div className={styles.section}>
        <h2>Codes Promo</h2>
        <table className={styles.promoTable}>
          <tbody>
            <tr>
              <td className={styles.codeCell}>
                <input
                  type="text"
                  placeholder="NEWCLIENT"
                  disabled
                  className={styles.fullWidthInput}
                />
              </td>
              <td className={styles.discountCell}>
                <input
                  type="number"
                  placeholder="10"
                  disabled
                  className={styles.smallInput}
                />
              </td>
              <td className={styles.actionCell}>
                <span>%</span>
              </td>
            </tr>
            {profile.promoCodes.map((code, index) => (
              <tr key={index}>
                <td className={styles.codeCell}>
                  <input
                    type="text"
                    value={code.code}
                    onChange={(e) =>
                      handlePromoCodeChange(index, "code", e.target.value)
                    }
                    className={styles.fullWidthInput}
                    placeholder="Code promo"
                  />
                </td>
                <td className={styles.discountCell}>
                  <input
                    type="number"
                    value={code.discount}
                    onChange={(e) =>
                      handlePromoCodeChange(index, "discount", e.target.value)
                    }
                    className={styles.smallInput}
                    placeholder="0"
                  />
                </td>
                <td className={styles.actionCell}>
                  <span>%</span>
                  <div className={styles.actionButtons}>
                    <button
                      onClick={() => handleDeletePromoCode(index)}
                      className={styles.deleteButton}
                    >
                      —
                    </button>
                    {index === profile.promoCodes.length - 1 && (
                      <button
                        onClick={handleAddPromoCode}
                        className={styles.addButton}
                      >
                        ✚
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="button" className={styles.saveButton}>
          Sauvegarder
        </button>
      </div>

      {/* Visioconférence */}
      <div className={styles.section}>
        <h2>Plateforme de Visioconférence</h2>
        <div className={styles.visioToggle}>
          <div className={styles.toggleContainer}>
            <input
              type="checkbox"
              checked={profile.usePlatformLink}
              onChange={(e) => handleInputChange(e)}
              name="usePlatformLink"
              id="platformToggle"
              className={styles.toggleInput}
            />
            <label
              htmlFor="platformToggle"
              className={styles.toggleLabel}
            ></label>
          </div>
          <span>
            {profile.usePlatformLink
              ? "Utiliser le lien de la plateforme"
              : "Vous n'avez pas de compte visioconférence"}
            <span
              className={styles.infoIcon}
              title="Ce service sera facturé 2€"
            >
              ⓘ
            </span>
          </span>
        </div>
        {!profile.usePlatformLink && (
          <input
            type="url"
            value={profile.customVisioLink}
            onChange={(e) => handleInputChange(e)}
            name="customVisioLink"
            placeholder="Votre lien de visioconférence personnalisé"
            className={styles.input}
          />
        )}
        <button type="button" className={styles.saveButton}>
          Sauvegarder
        </button>
      </div>

      {/* Méthodes de Paiement */}
      <div className={styles.section}>
        <h2>Méthodes de Paiement</h2>
        {["paypal" /*, "stripe", "banktransfer"*/].map((method) => (
          <div key={method} className={styles.paymentMethod}>
            <input
              type="checkbox"
              id={method}
              checked={profile.paymentMethods.includes(method)}
              onChange={(e) => {
                if (e.target.checked) {
                  setProfile((prev) => ({
                    ...prev,
                    paymentMethods: [...prev.paymentMethods, method],
                  }));
                } else {
                  setProfile((prev) => ({
                    ...prev,
                    paymentMethods: prev.paymentMethods.filter(
                      (m) => m !== method,
                    ),
                  }));
                }
              }}
            />
            <label htmlFor={method}>{method}</label>
          </div>
        ))}
        {profile.paymentMethods.includes("paypal") && (
          <div className={styles.formGroup}>
            <label htmlFor="paypalEmail">Adresse PayPal :</label>
            <input
              type="email"
              id="paypalEmail"
              value={profile.paypalEmail}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, paypalEmail: e.target.value }))
              }
              placeholder="votre-email@paypal.com"
            />
          </div>
        )}
        <button type="button" className={styles.saveButton}>
          Sauvegarder
        </button>
        <p className={styles.paypalInfo}>
          L'utilisation de PayPal permet d'automatiser les virements et
          d'effectuer des paiements immédiats pour chaque prestation réservée.
          Nous ne pouvons pas retirer d'argent de votre compte, uniquement
          effectuer des virements. Cela offre une solution sécurisée et pratique
          pour gérer vos paiements.
        </p>
      </div>
    </form>
  );
}
