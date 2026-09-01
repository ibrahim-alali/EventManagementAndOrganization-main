import pickle
import numpy as np
import os
from django.conf import settings

class Recommender:
    def __init__(self):
        self.model_path = os.path.join(settings.BASE_DIR, 'recommendation/model/recommender_model.pkl')
        self.data = self._load_model()

    def _load_model(self):
        if not os.path.exists(self.model_path):
            return None
        with open(self.model_path, 'rb') as f:
            return pickle.load(f)

    def get_top_n(self, user_id, n=5):
        if not self.data:
            return []
        
        try:
            # تحويل الـ user_id لنص لأننا خزناه كـ String في الكوماند السابق
            user_str = str(user_id)
            user_idx = self.data['user_categories'].index(user_str)
            
            # حساب التوقعات (Dot Product)
            preds = np.dot(self.data['user_features'][user_idx, :], self.data['item_features'])
            
            # ترتيب النتائج
            top_indices = np.argsort(-preds)[:n]
            return [self.data['item_categories'][i] for i in top_indices]
        except (ValueError, KeyError, IndexError):
            # في حال كان اليوزر جديد أو غير موجود في الموديل
            return []