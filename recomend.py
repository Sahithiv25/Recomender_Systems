from flask import Flask, request, jsonify, render_template
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)

# Load data and precompute TF-IDF for efficiency
df = pd.read_csv('data/cosmetics.csv')
df['text'] = df['Name'] + " " + df['Ingredients']
documents = df['text'].fillna("").tolist()

# TF-IDF Vectorization and Cosine Similarity
tfidf_vectorizer = TfidfVectorizer()
tfidf_matrix = tfidf_vectorizer.fit_transform(documents)
cosine_similarities = cosine_similarity(tfidf_matrix)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/get_recommendations', methods=['GET'])
def get_recommendations_endpoint():
    product_name = request.args.get('productName')
    skin_type = request.args.get('skinType')

    if not product_name or not skin_type:
        return jsonify({"error": "Product name and skin type are required."}), 400

    recommendations = get_recommendations(product_name, skin_type, df, cosine_similarities)
    return jsonify(recommendations)

def get_recommendations(product_name, skin_type, df, cosine_similarities, top_n=5):
    skin_type_column = {
        "Combination": "Combination",
        "Dry": "Dry",
        "Normal": "Normal",
        "Oily": "Oily",
        "Sensitive": "Sensitive"
    }

    # Filter products by skin type
    if skin_type not in skin_type_column:
        return []
    
    filtered_df = df[df[skin_type_column[skin_type]] == 1]
    
    try:
        product_index = filtered_df[filtered_df['Name'].str.contains(product_name, case=False)].index[0]
    except IndexError:
        return []
    
    similarity_scores = list(enumerate(cosine_similarities[product_index]))
    similarity_scores = sorted(similarity_scores, key=lambda x: x[1], reverse=True)
    top_recommendations = similarity_scores[1:top_n + 1]

    recommended_products = df.iloc[[index for index, score in top_recommendations]]
    return recommended_products[['Brand', 'Name', 'Price']].to_dict(orient='records')

if __name__ == '__main__':
    app.run(debug=True)
