
const plans = [
    {
        name: "Base Plan",
        id: "base",
        price: "₹500/month",
        description: "Ideal for light users. Limited access but enough to get started.",
    },
    {
        name: "Pro Plan",
        id: "pro",
        price: "₹2000/year",
        description: "Unlimited posting and access. Great for professionals and teams.",
    },
];

const SubscribePage = ({ userId, email }) => {
    const handleSubscribe = async (plan) => {
        try {
            const res = await fetch("/api/subscribe/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId, email, plan }),
            });

            if (!res.ok) {
                throw new Error("Failed to create checkout session");
            }

            const data = await res.json();
            window.location.href = data.url;
        } catch (err) {
            console.error("Subscription error", err);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-gray-100 to-gray-200 flex flex-col items-center justify-center px-4 py-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-10 text-center">
                Choose Your Plan
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                {plans.map((plan) => (
                    <div
                        key={plan.id}
                        className="bg-white rounded-2xl shadow-lg p-8 flex flex-col justify-between border hover:shadow-xl transition"
                    >
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                                {plan.name}
                            </h2>
                            <p className="text-gray-500 text-sm mb-4">{plan.description}</p>
                            <p className="text-xl font-bold text-indigo-600">
                                {plan.price}
                            </p>
                        </div>
                        <button
                            onClick={() => handleSubscribe(plan.id)}
                            className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-xl transition"
                        >
                            Subscribe
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SubscribePage;
