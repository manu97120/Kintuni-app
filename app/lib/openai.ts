// /app/lib/openai.ts
export async function fetchAIAnalysis(data: any) {
  try {
    console.log('Sending data to API:', data); // Ajout de log pour les données envoyées
    const response = await fetch('/api/generate-analysis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    });
    const result = await response.json();
    console.log('API Response:', result); // Ajout de log pour la réponse de l'API
    if (response.ok) {
      return result.analysis;
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error("Error fetching AI analysis:", error);
    return "There was an error generating your celestial analysis. Please try again later.";
  }
}