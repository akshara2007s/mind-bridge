import React, { useState } from 'react';
import {
    AppView,
    UserProfile,
    BehaviouralSignals,
    UserRole
} from './types';
import { initialMemberUser, initialCoordinatorUser, defaultSignals } from './data/mockData';

// Common Components
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { MobileNav } from './components/common/MobileNav';
import { DemoTourBar } from './components/common/DemoTourBar';
import { EmergencyModal } from './components/common/EmergencyModal';
import { ValidatedScreeningModal } from './components/common/ValidatedScreeningModal';

// Views
import { LandingView } from './components/views/LandingView';
import { AuthView } from './components/views/AuthView';
import { OnboardingView } from './components/views/OnboardingView';
import { DashboardView } from './components/views/DashboardView';
import { CompanionView } from './components/views/CompanionView';
import { CirclesView } from './components/views/CirclesView';
import { VideoCheckinView } from './components/views/VideoCheckinView';
import { ResultView } from './components/views/ResultView';
import { BaselineView } from './components/views/BaselineView';
import { JournalView } from './components/views/JournalView';
import { SupportView } from './components/views/SupportView';
import { InstitutionView } from './components/views/InstitutionView';
import { PrivacyView } from './components/views/PrivacyView';

export function App() {
    const [currentView, setCurrentView] = useState<AppView>('landing');
    const [user, setUser] = useState<UserProfile>(initialMemberUser);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [signals, setSignals] = useState<BehaviouralSignals>(defaultSignals);

    // Modals & Drawers
    const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
    const [isScreeningOpen, setIsScreeningOpen] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    // Handlers
    const handleAuthSuccess = (updatedUser: Partial<UserProfile>) => {
        setUser(prev => ({ ...prev, ...updatedUser }));
        setIsLoggedIn(true);
        if (updatedUser.role === 'coordinator') {
            setCurrentView('organization');
        } else {
            setCurrentView('onboarding');
        }
    };

    const handleOpenDemo = (role: 'member' | 'coordinator' = 'member') => {
        if (role === 'coordinator') {
            setUser(initialCoordinatorUser);
            setIsLoggedIn(true);
            setCurrentView('organization');
        } else {
            setUser(initialMemberUser);
            setIsLoggedIn(true);
            setCurrentView('dashboard');
        }
    };

    const handleToggleRole = () => {
        if (user.role === 'coordinator') {
            setUser(initialMemberUser);
            setCurrentView('dashboard');
        } else {
            setUser(initialCoordinatorUser);
            setCurrentView('organization');
        }
    };

    const handleOnboardingComplete = () => {
        setCurrentView('dashboard');
    };

    const handleCheckinComplete = (finalSignals: BehaviouralSignals) => {
        setSignals(finalSignals);
        setCurrentView('results');
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setCurrentView('landing');
    };

    const handleResetData = () => {
        setUser(prev => ({
            ...prev,
            checkinsCount: 0,
            streakDays: 0,
            belongingScore: 50
        }));
        setSignals(defaultSignals);
    };

    // Determine if viewing internal application layout with sidebar
    const isInternalApp = isLoggedIn && ![
        'landing',
        'login',
        'signup',
        'onboarding'
    ].includes(currentView);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-teal-500/20 selection:text-teal-900">
            {/* Top Navbar */}
            <Navbar
                currentView={currentView}
                onNavigate={setCurrentView}
                user={user}
                onOpenEmergency={() => setIsEmergencyOpen(true)}
                onOpenScreening={() => setIsScreeningOpen(true)}
                isLoggedIn={isLoggedIn}
                onToggleSidebar={() => setIsMobileSidebarOpen(true)}
                onSwitchRole={handleToggleRole}
            />

            <div className="flex-1 flex">
                {/* Desktop Sidebar (for internal app views) */}
                {isInternalApp && (
                    <Sidebar
                        currentView={currentView}
                        onNavigate={setCurrentView}
                        user={user}
                        onLogout={handleLogout}
                        isOpenMobile={isMobileSidebarOpen}
                        onCloseMobile={() => setIsMobileSidebarOpen(false)}
                        onSwitchRole={handleToggleRole}
                    />
                )}

                {/* Main Content Area */}
                <main className={`flex-1 transition-all ${isInternalApp ? 'lg:pl-64' : ''}`}>
                    <div className={`${isInternalApp ? 'p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto' : ''}`}>
                        {currentView === 'landing' && (
                            <LandingView
                                onNavigate={setCurrentView}
                                onOpenDemo={handleOpenDemo}
                            />
                        )}

                        {currentView === 'login' && (
                            <AuthView
                                mode="login"
                                onSuccess={handleAuthSuccess}
                                onNavigate={setCurrentView}
                            />
                        )}

                        {currentView === 'signup' && (
                            <AuthView
                                mode="signup"
                                onSuccess={handleAuthSuccess}
                                onNavigate={setCurrentView}
                            />
                        )}

                        {currentView === 'onboarding' && (
                            <OnboardingView
                                user={user}
                                onComplete={handleOnboardingComplete}
                                onNavigate={setCurrentView}
                            />
                        )}

                        {currentView === 'dashboard' && (
                            <DashboardView
                                user={user}
                                onNavigate={setCurrentView}
                                onOpenScreening={() => setIsScreeningOpen(true)}
                                onOpenEmergency={() => setIsEmergencyOpen(true)}
                            />
                        )}

                        {currentView === 'companion' && (
                            <CompanionView
                                onOpenEmergency={() => setIsEmergencyOpen(true)}
                                onOpenScreening={() => setIsScreeningOpen(true)}
                                onNavigateCircles={() => setCurrentView('circles')}
                            />
                        )}

                        {currentView === 'circles' && (
                            <CirclesView
                                onNavigate={setCurrentView}
                                onOpenScreening={() => setIsScreeningOpen(true)}
                            />
                        )}

                        {currentView === 'checkin' && (
                            <VideoCheckinView
                                onCompleteSession={handleCheckinComplete}
                                onNavigate={setCurrentView}
                            />
                        )}

                        {currentView === 'results' && (
                            <ResultView
                                signals={signals}
                                onNavigate={setCurrentView}
                                onOpenScreening={() => setIsScreeningOpen(true)}
                            />
                        )}

                        {currentView === 'journey' && (
                            <BaselineView
                                onNavigate={setCurrentView}
                                onOpenScreening={() => setIsScreeningOpen(true)}
                            />
                        )}

                        {currentView === 'journal' && (
                            <JournalView />
                        )}

                        {currentView === 'support' && (
                            <SupportView
                                onNavigate={setCurrentView}
                                onOpenEmergency={() => setIsEmergencyOpen(true)}
                                onOpenScreening={() => setIsScreeningOpen(true)}
                            />
                        )}

                        {currentView === 'organization' && (
                            <InstitutionView
                                onNavigate={setCurrentView}
                            />
                        )}

                        {currentView === 'privacy' && (
                            <PrivacyView
                                user={user}
                                onNavigate={setCurrentView}
                                onResetData={handleResetData}
                            />
                        )}
                    </div>
                </main>
            </div>

            {/* Mobile Bottom Dock (when in internal view) */}
            {isInternalApp && (
                <MobileNav
                    currentView={currentView}
                    onNavigate={setCurrentView}
                />
            )}

            {/* Global Interactive Hackathon Demo Tour Bar for Judges */}
            <DemoTourBar
                currentView={currentView}
                onNavigate={setCurrentView}
                userRole={user.role}
                onToggleRole={handleToggleRole}
            />

            {/* Emergency Crisis Modal */}
            <EmergencyModal
                isOpen={isEmergencyOpen}
                onClose={() => setIsEmergencyOpen(false)}
            />

            {/* Validated Self-Screening (PHQ-9) Modal */}
            <ValidatedScreeningModal
                isOpen={isScreeningOpen}
                onClose={() => setIsScreeningOpen(false)}
                onFindSupport={() => setCurrentView('support')}
            />
        </div>
    );
}

export default App;
