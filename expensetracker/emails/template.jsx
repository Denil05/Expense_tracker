import * as React from "react";
import { Body, Button, Container, Head, Heading, Html, Preview, Section, Text, Hr } from "@react-email/components";

export default function EmailTemplate({
    userName = "",
    type = "",
    data = {
        percentageUsed: 0,
        budgetAmount: 0,
        totalExpenses: 0,
        month: new Date().toLocaleString('default', { month: 'long' }),
        year: new Date().getFullYear()
    },
}) {
    // Default email content if type doesn't match
    const defaultContent = (
        <Html>
            <Head />
            <Preview>Welcome to Finance App</Preview>
            <Body style={styles.body}>
                <Container style={styles.container}>
                    <Section style={styles.header}>
                        <Heading style={styles.title}>Welcome</Heading>
                    </Section>
                    <Section style={styles.content}>
                        <Text style={styles.greeting}>Hello {userName},</Text>
                        <Text style={styles.message}>
                            Welcome to our Finance App. We're here to help you manage your finances better.
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );

    if(type === "budget-alert"){
        return (
            <Html>
                <Head />
                <Preview>Budget Alert: {data.percentageUsed}% of your monthly budget has been used</Preview>
                <Body style={styles.body}>
                    <Container style={styles.container}>
                        <Section style={styles.header}>
                            <Heading style={styles.title}>Budget Alert</Heading>
                            <Text style={styles.subtitle}>{data.month} {data.year}</Text>
                        </Section>

                        <Section style={styles.content}>
                            <Text style={styles.greeting}>Hello {userName},</Text>
                            
                            <Text style={styles.message}>
                                We wanted to let you know that you've used <strong>{data.percentageUsed.toFixed(1)}%</strong> of your monthly budget. 
                                Here's a breakdown of your current spending:
                            </Text>

                            <Section style={styles.statsContainer}>
                                <div style={styles.stat}>
                                    <Text style={styles.statLabel}>Monthly Budget</Text>
                                    <Text style={styles.statValue}>${Number(data.budgetAmount).toLocaleString()}</Text>
                                </div>
                                <div style={styles.stat}>
                                    <Text style={styles.statLabel}>Spent So Far</Text>
                                    <Text style={styles.statValue}>${Number(data.totalExpenses).toLocaleString()}</Text>
                                </div>
                                <div style={styles.stat}>
                                    <Text style={styles.statLabel}>Remaining</Text>
                                    <Text style={styles.statValue}>${(Number(data.budgetAmount) - Number(data.totalExpenses)).toLocaleString()}</Text>
                                </div>
                            </Section>

                            <Section style={styles.progressContainer}>
                                <div style={styles.progressBar}>
                                    <div 
                                        style={{
                                            ...styles.progressFill,
                                            width: `${data.percentageUsed}%`,
                                            backgroundColor: data.percentageUsed > 90 ? '#ef4444' : '#3b82f6'
                                        }}
                                    />
                                </div>
                            </Section>

                            <Section style={styles.actionContainer}>
                                <Text style={styles.actionText}>
                                    {data.percentageUsed > 90 
                                        ? "You're close to exceeding your budget! Consider reviewing your expenses."
                                        : "You're on track with your budget. Keep up the good work!"}
                                </Text>
                                <Button 
                                    href="http://localhost:3000/dashboard" 
                                    style={styles.button}
                                >
                                    View Detailed Report
                                </Button>
                            </Section>
                        </Section>

                        <Hr style={styles.hr} />

                        <Section style={styles.footer}>
                            <Text style={styles.footerText}>
                                This is an automated message. Please do not reply to this email.
                            </Text>
                            <Text style={styles.footerText}>
                                To manage your notification preferences, visit your account settings.
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Html>
        );
    }

    return defaultContent;
}

const styles = {
    body: {
        backgroundColor: "#f6f9fc",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif",
        margin: 0,
        padding: 0,
    },
    container: {
        backgroundColor: "#ffffff",
        margin: "0 auto",
        padding: "20px",
        maxWidth: "600px",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    },
    header: {
        textAlign: "center",
        padding: "20px 0",
        borderBottom: "1px solid #e5e7eb",
    },
    title: {
        color: "#111827",
        fontSize: "24px",
        fontWeight: "bold",
        margin: "0 0 8px",
    },
    subtitle: {
        color: "#6b7280",
        fontSize: "16px",
        margin: 0,
    },
    content: {
        padding: "24px 0",
    },
    greeting: {
        color: "#111827",
        fontSize: "18px",
        fontWeight: "500",
        margin: "0 0 16px",
    },
    message: {
        color: "#4b5563",
        fontSize: "16px",
        lineHeight: "1.5",
        margin: "0 0 24px",
    },
    statsContainer: {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        margin: "24px 0",
    },
    stat: {
        backgroundColor: "#f9fafb",
        padding: "16px",
        borderRadius: "6px",
        border: "1px solid #e5e7eb",
    },
    statLabel: {
        color: "#6b7280",
        fontSize: "14px",
        margin: "0 0 4px",
    },
    statValue: {
        color: "#111827",
        fontSize: "20px",
        fontWeight: "600",
        margin: 0,
    },
    progressContainer: {
        margin: "24px 0",
    },
    progressBar: {
        height: "8px",
        backgroundColor: "#e5e7eb",
        borderRadius: "4px",
        overflow: "hidden",
    },
    progressFill: {
        height: "100%",
        borderRadius: "4px",
        transition: "width 0.3s ease",
    },
    actionContainer: {
        textAlign: "center",
        margin: "32px 0",
    },
    actionText: {
        color: "#4b5563",
        fontSize: "16px",
        margin: "0 0 16px",
    },
    button: {
        backgroundColor: "#3b82f6",
        color: "#ffffff",
        padding: "12px 24px",
        borderRadius: "6px",
        textDecoration: "none",
        fontSize: "16px",
        fontWeight: "500",
        display: "inline-block",
    },
    hr: {
        borderColor: "#e5e7eb",
        margin: "24px 0",
    },
    footer: {
        textAlign: "center",
        padding: "16px 0",
    },
    footerText: {
        color: "#6b7280",
        fontSize: "14px",
        margin: "4px 0",
    },
}; 