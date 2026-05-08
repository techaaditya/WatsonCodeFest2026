import random
from typing import List, Dict, Any

KNOWLEDGE_BASE = {
    "beta_thalassemia": {
        "description": "Beta thalassemia is an inherited blood disorder that reduces the production of hemoglobin.",
        "symptoms": ["Fatigue", "Weakness", "Pale skin", "Abdominal swelling", "Dark urine"],
        "prevalence": "Common in Nepal's Terai region, especially in Tharu and Madhesi communities.",
        "management": ["Regular blood transfusions", "Iron chelation therapy", "Folic acid supplements"]
    },
    "sickle_cell": {
        "description": "Sickle cell disease causes red blood cells to become misshapen and break down.",
        "symptoms": ["Pain episodes", "Anemia", "Swelling of hands/feet", "Frequent infections", "Vision problems"],
        "prevalence": "High carrier rate in Western Terai (Tharu communities).",
        "management": ["Hydroxyurea", "Pain management", "Antibiotics", "Hydration"]
    },
    "g6pd": {
        "description": "G6PD deficiency is a condition where red blood cells break down when exposed to certain substances.",
        "symptoms": ["Jaundice", "Dark urine", "Fatigue", "Shortness of breath"],
        "prevalence": "X-linked, found across South Asian populations.",
        "triggers": ["Fava beans", "Antimalarial drugs", "Naphthalene", "Infections"]
    }
}

RESPONSES = [
    "That's a great question about {topic}. {info}",
    "Regarding {topic}, it's important to know that {info}",
    "In the context of genomics, {topic} is {info}",
    "Our analysis indicates that {topic} is related to {info}"
]

def generate_counselor_response(message: str, mode: str = "general") -> str:
    message = message.lower()
    
    if "hello" in message or "hi" in message:
        return "Hello! I am GenoGuide, your AI Genetic Counselor. How can I help you today with your genomic insights?"
    
    found_topic = None
    if "thalassemia" in message: found_topic = "beta_thalassemia"
    elif "sickle" in message: found_topic = "sickle_cell"
    elif "g6pd" in message: found_topic = "g6pd"
    
    if found_topic:
        info = KNOWLEDGE_BASE[found_topic]["description"]
        template = random.choice(RESPONSES)
        return template.format(topic=found_topic.replace("_", " ").title(), info=info)
    
    if mode == "specific":
        return "I've received your specific data. Based on the 4 focus diseases in Nepal, I recommend regular screening if you are in a high-risk group."
    
    return "I am specialized in the 4 monogenic diseases prevalent in Nepal: Beta Thalassemia, Sickle Cell, G6PD Deficiency, and Y-Chromosome Infertility. Feel free to ask about any of these!"
