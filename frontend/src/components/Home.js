import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';  // Ensure correct path to App.css

function Home() {
    return (
        <div className="home-container">
            {/* Main Content Section */}
            <main className="main-content">
                <div className="cta-section">
                    <h1>Welcome to PennyPal!</h1>
                    <p>Your savings journey starts here. Make your first deposit now!</p>
                    <Link to="/deposit">
                        <button className="cta-button">Deposit</button>
                    </Link>
                </div>

                {/* Piggy Bank Visual */}
                <div className="piggy-bank-graphic">
                    <img src="/piggy_animation.gif" alt="Piggy Bank" />
                </div>
            </main>
        </div>
    );
}

export default Home;
