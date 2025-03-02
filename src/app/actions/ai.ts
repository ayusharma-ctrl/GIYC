import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export async function generateDestinationContent() {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Generate travel content for a random City (new each time) in JSON format:
  {
    "city": "Pick a random city",
    "country": "Name of country",
    "clues": [2 cryptic clues],
    "fun_facts": [2 interesting facts],
    "trivia": [2 trivia items],
  }
  
  For example:
  {
    "city": "Paris",
    "country": "France",
    "clues": [
        "This city is home to a famous tower that sparkles every night.",
        "Known as the 'City of Love' and a hub for fashion and art."
    ],
    "fun_facts": [
        "The Eiffel Tower was supposed to be dismantled after 20 years but was saved because it was useful for radio transmissions!",
        "Paris has only one stop sign in the entire city—most intersections rely on priority-to-the-right rules."
    ],
    "trivia": [
        "This city is famous for its croissants and macarons. Bon appétit!",
        "Paris was originally a Roman city called Lutetia."
    ]
  }

  Please follow the same pattern and return the response in exactly same format.
  
  `;

    const result = await model.generateContent(prompt);
    return sanitize(JSON.parse(result.response.text()));
}

// this gemini model doesn't support image output - free tier
export async function generateImage(prompt: string): Promise<string> {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
        const result = await model.generateContent(`
        Generate a realistic image prompt for a travel guessing game about: 
        ${prompt}
        The image should be descriptive but not reveal the location obviously.
      `);

        const imagePrompt = result.response.text();
        console.log({ imagePrompt })
        // If using actual image generation API, implement here
        // This example returns a placeholder URL
        return `https://source.unsplash.com/random/800x600/?${encodeURIComponent(prompt)}`;
    } catch (error) {
        console.error("Image generation failed:", error);
        return "/placeholder-image.jpg";
    }
}

const sanitize = (s: string) => {
    return s.substring(7, s.length - 4);
}