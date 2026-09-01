# recommendation/utils.py
from recommendation.models import UserInteraction
def log_visit(user, target_type, target_id):

    if not user or not user.is_authenticated:
        return  # تجاهل المستخدمين غير المسجلين
    UserInteraction.objects.create(
        user=user,
        interaction_type=f'visit_{target_type}',  # 'visit_event' أو 'visit_venue'
        target_type=target_type,
        target_id=target_id
    )