import re
from typing import List, Tuple
from schemas import AnalysisRequest, AnalysisResponse, ReviewAnalysisResult, ReviewItem

# Domain topic keywords for Customer Intelligence
TOPIC_KEYWORDS = {
    "Delivery & Speed": ["delivery", "delay", "late", "slow", "driver", "courier", "order", "time", "wait"],
    "Customer Support": ["service", "staff", "waiter", "host", "rude", "manager", "support", "help", "attitude"],
    "Product Quality": ["quality", "taste", "food", "coffee", "dish", "flavor", "fresh", "cold", "stale", "portion"],
    "Pricing & Value": ["price", "expensive", "overpriced", "cost", "value", "bill", "worth", "cheap"],
    "Cleanliness & Ambience": ["clean", "dirty", "hygiene", "ambience", "atmosphere", "noise", "table", "washroom"]
}

POSITIVE_WORDS = {"great", "excellent", "amazing", "love", "awesome", "fresh", "delicious", "friendly", "fast", "best", "perfect", "good"}
NEGATIVE_WORDS = {"terrible", "horrible", "bad", "slow", "late", "cold", "dirty", "rude", "overpriced", "worst", "delay", "poor", "ruined"}

def classify_sentiment(content: str, rating: int = None) -> Tuple[str, float, float]:
    """
    Classifies sentiment label, sentiment score (0.0 - 1.0), and confidence.
    """
    text_lower = content.lower()
    words = set(re.findall(r'\b\w+\b', text_lower))

    pos_count = len(words.intersection(POSITIVE_WORDS))
    neg_count = len(words.intersection(NEGATIVE_WORDS))

    if rating is not None:
        if rating >= 4:
            return "POSITIVE", 0.85 + (pos_count * 0.03), 0.92
        elif rating <= 2:
            return "NEGATIVE", 0.15 - (neg_count * 0.03), 0.92
        else:
            return "NEUTRAL", 0.50, 0.85

    if pos_count > neg_count:
        score = min(0.95, 0.65 + (pos_count * 0.1))
        return "POSITIVE", score, 0.88
    elif neg_count > pos_count:
        score = max(0.05, 0.35 - (neg_count * 0.1))
        return "NEGATIVE", score, 0.88
    else:
        return "NEUTRAL", 0.50, 0.80


def extract_topics(content: str) -> List[str]:
    """
    Extracts relevant business topic categories from text.
    """
    text_lower = content.lower()
    found_topics = []

    for topic_name, keywords in TOPIC_KEYWORDS.items():
        if any(kw in text_lower for kw in keywords):
            found_topics.append(topic_name)

    return found_topics if found_topics else ["General Feedback"]


def assign_priority(sentiment: str, rating: int = None, content: str = "") -> str:
    """
    Assigns issue priority rating (CRITICAL, HIGH, MEDIUM, LOW).
    """
    text_lower = content.lower()
    critical_terms = {"ruined", "horrible", "poisoning", "scam", "illegal", "refund", "never again"}

    if any(term in text_lower for term in critical_terms):
        return "CRITICAL"

    if sentiment == "NEGATIVE" or (rating is not None and rating <= 2):
        return "HIGH"

    if sentiment == "NEUTRAL" or (rating is not None and rating == 3):
        return "MEDIUM"

    return "LOW"


def analyze_review_batch(request: AnalysisRequest) -> AnalysisResponse:
    results: List[ReviewAnalysisResult] = []

    pos_cnt = 0
    neg_cnt = 0
    neu_cnt = 0
    total_confidence = 0.0

    for item in request.reviews:
        sentiment, score, confidence = classify_sentiment(item.content, item.rating)
        topics = extract_topics(item.content)
        priority = assign_priority(sentiment, item.rating, item.content)

        if sentiment == "POSITIVE":
            pos_cnt += 1
        elif sentiment == "NEGATIVE":
            neg_cnt += 1
        else:
            neu_cnt += 1

        total_confidence += confidence

        results.append(
            ReviewAnalysisResult(
                id=item.id,
                content=item.content,
                sentiment=sentiment,
                sentiment_score=round(score, 2),
                confidence=round(confidence, 2),
                priority=priority,
                topics=topics,
                key_phrases=[w for w in re.findall(r'\b\w{4,}\b', item.content.lower()) if w in POSITIVE_WORDS or w in NEGATIVE_WORDS]
            )
        )

    total = len(results)
    avg_conf = round(total_confidence / total, 2) if total > 0 else 0.0
    overall = "POSITIVE" if pos_cnt >= neg_cnt and pos_cnt >= neu_cnt else ("NEGATIVE" if neg_cnt >= pos_cnt else "NEUTRAL")

    return AnalysisResponse(
        total_analyzed=total,
        overall_sentiment=overall,
        positive_percentage=round((pos_cnt / total) * 100, 1) if total > 0 else 0.0,
        negative_percentage=round((neg_cnt / total) * 100, 1) if total > 0 else 0.0,
        neutral_percentage=round((neu_cnt / total) * 100, 1) if total > 0 else 0.0,
        average_confidence=avg_conf,
        results=results,
    )
