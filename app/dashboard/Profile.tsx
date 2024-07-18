import React, { useState, useEffect, useCallback } from "react";
import styles from "./profile.module.css";

export default function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    avatar: "",
    description: "",
    services: [
      { id: Date.now(), name: "", description: "", price: "", duration: "" }
    ],
    availabilities: {
      Lundi: { isAvailable: true, slots: [{ start: "09:00", end: "17:00" }] },
      Mardi: { isAvailable: true, slots: [{ start: "09:00", end: "17:00" }] },
     Mercredi: {
        isAvailable: true,
        slots: [{ start: "09:00", end: "17:00" }],
      },
      Jeudi: {
        isAvailable: true,
        slots: [{ start: "09:00", end: "17:00" }],
      },
      Vendredi: { isAvailable: true, slots: [{ start: "09:00", end: "17:00" }] },
      Samedi: { isAvailable: false, slots: [] },
      Dimanche: { isAvailable: false, slots: [] },
    },
    socialLinks: [
      { platform: "instagram", url: "" },
    { platform: "youtube", url: "" },
    { platform: "campus", url: "" }
    ],
    visioLinks: [],
    paymentMethods: [],
    paypalEmail: "",
    promoCodes: [""],
    usePlatformLink: false,
    customVisioLink: "",
    noticePeriod: "24",
    customNoticePeriod: "",
    useCalendly: false,
    calendlyToken: "",
  });

  const [errors, setErrors] = useState({});
 
  const validateProfile = () => {
    const newErrors = {};
    // Validation du nom
    if (!profile.name.trim()) {
      newErrors.name = { message: "Le nom est requis.", color: "red" };
    }
  
    // Validation des services
    profile.services.forEach((service, index) => {
      if (isNaN(service.price)) {
        newErrors[`servicePrice${index}`] = { message: "Le tarif doit être un nombre.", color: "red" };
      }
      if (isNaN(service.duration)) {
        newErrors[`serviceDuration${index}`] = { message: "La durée doit être un nombre.", color: "red" };
      }
    });
  
    // Validation des liens sociaux
    profile.socialLinks.forEach((link, index) => {
      try {
        new URL(link.url);
      } catch (_) {
        newErrors[`socialLink${index}`] = { message: "URL invalide.", color: "red" };
      }
    });
  
    // Validation de l'email PayPal
    if (profile.paypalEmail && !/\S+@\S+\.\S+/.test(profile.paypalEmail)) {
      newErrors.paypalEmail = { message: "Adresse email PayPal invalide.", color: "red" };
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSaveProfile = async () => {
    if (!validateProfile()) {
      return;
    }
    try {
      const response = await fetch('/api/saveProfile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ profile }),
      });
  
      if (!response.ok) {
        throw new Error('Une erreur est survenue lors de la sauvegarde du profil.');
      }
  
      const data = await response.json();
      console.log('Profil sauvegardé avec succès:', data);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du profil:", error);
    }
  };


  const handleCalendlyConnect = () => {
    window.open(
      `https://auth.calendly.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_CALENDLY_CLIENT_ID}&response_type=code&redirect_uri=${process.env.NEXT_PUBLIC_CALENDLY_REDIRECT_URI}`,
      "_blank",
      "width=500,height=600"
    );
  };

  const handleDayAvailability = (day, isAvailable) => {
    setProfile((prev) => ({
      ...prev,
      availabilities: {
        ...prev.availabilities,
        [day]: {
          isAvailable,
          slots: isAvailable ? [{ start: "09:00", end: "17:00" }] : []
        }
      }
    }));
  };

  const handleAvailabilityChange = (day, index, field, value) => {
    setProfile((prev) => {
      const newAvailabilities = { ...prev.availabilities };
      newAvailabilities[day].slots[index][field] = value;
      return { ...prev, availabilities: newAvailabilities };
    });
  };

  const handleAddAvailability = useCallback((day) => {
    setProfile((prev) => {
      const newAvailabilities = { ...prev.availabilities };
      newAvailabilities[day].slots = [
        ...newAvailabilities[day].slots,
        { start: "09:00", end: "17:00" }
      ];
      return { ...prev, availabilities: newAvailabilities };
    });
  }, []);

  const handleDeleteAvailability = (day, index) => {
    setProfile((prev) => {
      const newAvailabilities = { ...prev.availabilities };
      newAvailabilities[day].slots.splice(index, 1);
      if (newAvailabilities[day].slots.length === 0) {
        newAvailabilities[day].isAvailable = false;
      }
      return { ...prev, availabilities: newAvailabilities };
    });
  };

  const renderAvailabilityRow = (day, { isAvailable, slots }) => {
    return (
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
            <div className={styles.timeSlots}>
              {slots.map((slot, index) => (
                <div key={index} className={styles.timeSlot}>
                  <input
                    type="time"
                    value={slot.start}
                    onChange={(e) =>
                      handleAvailabilityChange(day, index, "start", e.target.value)
                    }
                    className={styles.input}
                  />
                  <span>-</span>
                  <input
                    type="time"
                    value={slot.end}
                    onChange={(e) =>
                      handleAvailabilityChange(day, index, "end", e.target.value)
                    }
                    className={styles.input}
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

    );
  };

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
      return {
        ...prev,
        services: newServices,
      };
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
    console.log("handleSubmit");
    e.preventDefault();
  };

  // Fonction pour gérer le téléchargement et l'enregistrement de l'avatar
  const handleAvatarUpload = async (e) => {
    const maxFileSize = 2 * 1024 * 1024; // 2MB
    if (e.target.files && e.target.files[0]) {
      if (e.target.files[0].size > maxFileSize) {
        setErrors((prev) => ({ ...prev, avatar: "La taille du fichier doit être inférieure à 2MB." }));
        return;
      }
      const formData = new FormData();
      formData.append('file', e.target.files[0]);
  
      try {
        const response = await fetch('/api/uploadAvatar', {
          method: 'POST',
          body: formData,
        });
  
        const data = await response.json();
        if (response.ok) {
          setProfile((prev) => ({
            ...prev,
            avatar: data.filePath,
          }));
          setErrors((prev) => ({ ...prev, avatar: null }));
        } else {
          console.error("Erreur lors du téléchargement de l'avatar:", data.error);
        }
      } catch (error) {
        console.error("Erreur lors du téléchargement de l'avatar:", error);
      }
    }
  };
// Remplacez l'événement onChange de l'input pour l'avatar par handleAvatarUpload
<input
  type="file"
  id="avatar"
  name="avatar"
  onChange={handleAvatarUpload}
  className={styles.input}
/>

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
            className={styles.input}
          />
         {errors.name && <span style={{ color: errors.name.color }}>{errors.name.message}</span>}
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
            className={styles.input}
          />
          {profile.avatar && (
            <img src={profile.avatar} alt="Avatar" className={styles.avatar} />
          )}
          {errors.avatar && <span style={{ color: errors.avatar.color }}>{errors.avatar.message}</span>}
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={profile.description}
            onChange={handleInputChange}
            maxLength={1500}
            className={`${styles.descriptionInput} ${styles.input}`}
            rows={5}
            placeholder="Ici la description qui sera visibile par les utilisateurs de l'application"
          />
          <div className={styles.charCount}>
            {profile.description.length}/1500
          </div>
        </div>
        <br />
        <button type="button" className={styles.saveButton} onClick={handleSaveProfile}>
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
              <th className={styles.descriptionCell}>Description</th>
              <th className={styles.priceCell}>Tarif</th>
              <th className={styles.durationCell}>Durée (min)</th>
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
                    placeholder="Dossier Kintuni"
                    className={styles.input}
                  />
                </td>
                <td className={styles.descriptionCell}>
                  <textarea
                    value={service.description || ""}
                    onChange={(e) =>
                      handleServiceChange(index, "description", e.target.value)
                    }
                    placeholder="Ce dossier vise à approfondir la connaissance de soi en aidant l'individu à comprendre le sens de sa présence et les causes de ses dysfonctionnements sur Terre."
                    rows={3}
                    maxLength={500}
                    className={`${styles.input} ${styles.descriptionTextarea}`}
                  />
                  <div className={styles.charCount}>
                    {(service.description || "").length}/500
                  </div>
                </td>
                <td className={styles.priceCell}>
                  <input
                    type="text"
                    value={service.price}
                    onChange={(e) =>
                      handleServiceChange(index, "price", e.target.value)
                    }
                    placeholder="350€"
                    className={`${styles.input} ${styles.smallInput}`}
                  />
                  {errors[`servicePrice${index}`] && (
        <span style={{ color: errors[`servicePrice${index}`].color }}>
          {errors[`servicePrice${index}`].message}
        </span>
      )}
                   </td>
                <td className={styles.durationCell}>
                  <input
                    type="text"
                    value={service.duration}
                    onChange={(e) =>
                      handleServiceChange(index, "duration", e.target.value)
                    }
                    placeholder="90 min"
                    className={`${styles.input} ${styles.smallInput}`}
                  />
                   {errors[`serviceDuration${index}`] && (
        <span style={{ color: errors[`serviceDuration${index}`].color }}>
          {errors[`serviceDuration${index}`].message}
        </span>
      )}
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
        <button type="button" className={styles.saveButton} onClick={handleSaveProfile}>
          Sauvegarder
        </button>
      </div>
    
 
      {/* Disponibilités */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Disponibilités</h2>
        <div className={styles.calendlyToggleContainer}>
          <div className={styles.toggleContainer}>
            <input
              type="checkbox"
              id="calendlyToggle"
              checked={profile.useCalendly}
              onChange={(e) =>
                setProfile((prev) => ({
                  ...prev,
                  useCalendly: e.target.checked,
                }))
              }
              className={styles.toggleInput}
            />
            <label htmlFor="calendlyToggle" className={styles.toggleLabel}></label>
          </div>
          <span className={styles.calendlyToggleLabel}>
            Utiliser Calendly pour synchroniser les disponibilités
          </span>
        </div>

        {profile.useCalendly ? (
          <div className={styles.calendlyConnect}>
            <button
              type="button"
              onClick={handleCalendlyConnect}
              className={styles.connectButton}
            >
              Synchroniser votre compte Calendly
            </button>
          </div>
        ) : (
          <>
            {Object.entries(profile.availabilities).map(([day, availability]) =>
              renderAvailabilityRow(day, availability)
            )}
            <button type="button" className={styles.saveButton} onClick={handleSaveProfile}>
              Sauvegarder
            </button>
          </>
        )}
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
              className={styles.input}
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
              placeholder={
                link.platform === 'instagram' ? 'https://www.instagram.com/username' :
                link.platform === 'facebook' ? 'https://www.facebook.com/username' :
                link.platform === 'twitter' ? 'https://twitter.com/username' :
                link.platform === 'discord' ? 'https://discord.com/invite/xxxx' :
                link.platform === 'website' ? 'https://www.yourwebsite.com' :
                link.platform === 'campus' ? 'https://ecole-kimuntu.com/members/username' :
                link.platform === 'youtube' ? 'https://www.youtube.com/channel/xxxx' :
                'https://...'
              }
              className={`${styles.input} ${styles.socialInput}`}
            />
             {errors[`socialLink${index}`] && (
        <span style={{ color: errors[`socialLink${index}`].color }}>
          {errors[`socialLink${index}`].message}
        </span>
      )}
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
  <button type="button" className={styles.saveButton} onClick={handleSaveProfile}>
    Sauvegarder
  </button>
</div>

      {/* Codes Promo */}
      <div className={styles.section}>
        <h2>Codes Promo</h2>
        <table className={styles.promoTable}>
          <thead>
            <tr>
              <th>Code</th>
              <th>Promotion appliquée (en %)</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {profile.promoCodes.map((code, index) => (
              <tr key={index}>
                <td className={styles.codeCell}>
                  <input
                    type="text"
                    value={code.code}
                    onChange={(e) =>
                      handlePromoCodeChange(index, "code", e.target.value)
                    }
                    className={`${styles.fullWidthInput} ${styles.input}`}
                    placeholder="Ex: kintuni2024"
                  />
                </td>
                <td className={styles.discountCell}>
                  <input
                    type="number"
                    value={code.discount}
                    onChange={(e) =>
                      handlePromoCodeChange(index, "discount", e.target.value)
                    }
                    className={`${styles.smallInput} ${styles.input}`}
                    placeholder="10"
                  />
                </td>
                <td className={styles.actionCell}>
                  <span></span>
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
        <button type="button" className={styles.saveButton} onClick={handleSaveProfile}>
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
              data-tooltip="Service facturé 2€/mois"
              /*onMouseOver={() => alert("Ce service sera facturé 2€")}*/
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
        <button type="button" className={styles.saveButton} onClick={handleSaveProfile}>
          Sauvegarder
        </button>
        <p className={styles.paypalInfo}>
         Assurez-vous que votre offre ne comporte pas de limitation, 
         notamment concernant la durée d'un appel vidéo.
        </p>
      </div>

      {/* Méthodes de Paiement */}
      <div className={styles.section}>
        <h2>Méthodes de Paiement</h2>
        {["Paypal"/*, "stripe", "banktransfer"*/].map((method) => (
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
        {profile.paymentMethods.includes("Paypal") && (
          <div className={styles.formGroup}>
            <label htmlFor="paypalEmail">Adresse email PayPal :</label>
            <input
              type="email"
              id="paypalEmail"
              value={profile.paypalEmail}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, paypalEmail: e.target.value }))
              }
              placeholder="exemple@gmail.com"
              className={styles.input}
            />
             {errors.paypalEmail && <span style={{ color: errors.paypalEmail.color }}>{errors.paypalEmail.message}</span>}
             </div>
        )}
        <button type="button" className={styles.saveButton} onClick={handleSaveProfile}>
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