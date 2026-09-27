import io
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

class BusinessPlanChartGenerator:
    """
    Generates clean, professional PNG chart images for inclusion in PDF and DOCX business plans.
    """

    @staticmethod
    def generate_probability_chart(probabilities: dict) -> bytes:
        """
        Generates a horizontal bar chart showing Class Probability Distribution.
        """
        labels = list(probabilities.keys())
        values = [val * 100 for val in probabilities.values()]

        colors = ['#22c55e' if 'Feasible' == l else '#eab308' if 'Conditionally' in l else '#ef4444' for l in labels]

        fig, ax = plt.subplots(figsize=(6, 2.2), dpi=200)
        fig.patch.set_facecolor('#ffffff')
        ax.set_facecolor('#f8fafc')

        bars = ax.barh(labels, values, color=colors, height=0.55, edgecolor='none')
        ax.set_xlim(0, 100)
        ax.set_xlabel('Model Probability (%)', fontsize=8, fontweight='bold', color='#475569')
        ax.tick_params(axis='y', labelsize=8, colors='#1e293b')
        ax.tick_params(axis='x', labelsize=8, colors='#475569')
        ax.spines['top'].set_visible(False)
        ax.spines['right'].set_visible(False)
        ax.spines['left'].set_color('#cbd5e1')
        ax.spines['bottom'].set_color('#cbd5e1')

        # Add data labels on bars
        for bar in bars:
            width = bar.get_width()
            ax.text(width + 2, bar.get_y() + bar.get_height()/2, f'{width:.1f}%',
                    va='center', ha='left', fontsize=8, fontweight='bold', color='#1e293b')

        plt.tight_layout()
        buf = io.BytesIO()
        plt.savefig(buf, format='png', dpi=200, bbox_inches='tight')
        plt.close(fig)
        buf.seek(0)
        return buf.getvalue()

    @staticmethod
    def generate_financial_breakdown_chart(capital: float, budget: float, rev_est: float) -> bytes:
        """
        Generates a vertical bar chart comparing Capital, Operating Budget, and Est Revenue.
        """
        categories = ['Available Capital', 'Monthly Budget', 'Est. Monthly Revenue']
        values = [capital / 1000, budget / 1000, rev_est / 1000] # In '000 LKR
        colors = ['#3b82f6', '#818cf8', '#22c55e']

        fig, ax = plt.subplots(figsize=(5.5, 2.4), dpi=200)
        fig.patch.set_facecolor('#ffffff')
        ax.set_facecolor('#f8fafc')

        bars = ax.bar(categories, values, color=colors, width=0.45)
        ax.set_ylabel('Amount (LKR in Thousands)', fontsize=8, fontweight='bold', color='#475569')
        ax.tick_params(axis='x', labelsize=8, colors='#1e293b')
        ax.tick_params(axis='y', labelsize=8, colors='#475569')
        ax.spines['top'].set_visible(False)
        ax.spines['right'].set_visible(False)
        ax.spines['left'].set_color('#cbd5e1')
        ax.spines['bottom'].set_color('#cbd5e1')

        for bar in bars:
            height = bar.get_height()
            ax.text(bar.get_x() + bar.get_width()/2., height + (max(values)*0.03),
                    f'{height:,.0f}k', ha='center', va='bottom', fontsize=8, fontweight='bold', color='#1e293b')

        plt.tight_layout()
        buf = io.BytesIO()
        plt.savefig(buf, format='png', dpi=200, bbox_inches='tight')
        plt.close(fig)
        buf.seek(0)
        return buf.getvalue()
