#!/usr/bin/env node

/**
 * Maximus Consultancy Services - Supabase Setup Script
 * This script helps set up and configure the Supabase backend
 */

const fs = require('fs');
const path = require('path');
const { db, testConnection } = require('./lib/supabase');

console.log('🚀 Starting Maximus Consultancy Services Supabase Setup...\n');

async function checkEnvironment() {
    console.log('📋 Checking environment configuration...');
    
    const requiredVars = ['SUPABASE_URL', 'SUPABASE_ANON_KEY'];
    const missingVars = [];
    
    requiredVars.forEach(varName => {
        if (!process.env[varName]) {
            missingVars.push(varName);
        }
    });
    
    if (missingVars.length > 0) {
        console.error('❌ Missing required environment variables:');
        missingVars.forEach(varName => {
            console.error(`   - ${varName}`);
        });
        console.error('\nPlease update your .env file with the correct Supabase credentials.');
        return false;
    }
    
    console.log('✅ Environment variables configured correctly');
    return true;
}

async function testSupabaseConnection() {
    console.log('🔗 Testing Supabase connection...');
    
    try {
        const isConnected = await testConnection();
        if (isConnected) {
            console.log('✅ Successfully connected to Supabase database');
            return true;
        } else {
            console.error('❌ Failed to connect to Supabase database');
            return false;
        }
    } catch (error) {
        console.error('❌ Database connection error:', error.message);
        return false;
    }
}

async function checkDatabaseTables() {
    console.log('📊 Checking database tables...');
    
    try {
        // Test if main tables exist by trying to fetch data
        const services = await db.getServices();
        const stats = await db.getCompanyStats();
        const team = await db.getTeamMembers();
        
        console.log(`✅ Found ${services.length} services in database`);
        console.log(`✅ Found ${stats.length} company stats in database`);
        console.log(`✅ Found ${team.length} team members in database`);
        
        return true;
    } catch (error) {
        console.error('❌ Database tables check failed:', error.message);
        console.error('\n💡 You may need to run the database setup SQL script first.');
        console.error('   Check the database_setup.sql file for the complete schema.');
        return false;
    }
}

async function displayDatabaseInfo() {
    console.log('\n📈 Database Summary:');
    console.log('==================');
    
    try {
        const services = await db.getServices();
        const stats = await db.getCompanyStats();
        const team = await db.getTeamMembers();
        const contacts = await db.getContactMessages(10);
        
        console.log(`📦 Services: ${services.length} active`);
        console.log(`👥 Team Members: ${team.length} active`);
        console.log(`📊 Company Stats: ${stats.length} metrics`);
        console.log(`📧 Recent Contacts: ${contacts.length} messages`);
        
        if (services.length > 0) {
            console.log('\n🛠️  Available Services:');
            services.forEach((service, index) => {
                console.log(`   ${index + 1}. ${service.service_name} (${service.category})`);
            });
        }
        
        if (team.length > 0) {
            console.log('\n👨‍💼 Team Members:');
            team.forEach((member, index) => {
                const founder = member.is_founder ? ' (Founder)' : '';
                console.log(`   ${index + 1}. ${member.name} - ${member.position}${founder}`);
            });
        }
        
    } catch (error) {
        console.error('❌ Error fetching database info:', error.message);
    }
}

function displayEndpoints() {
    console.log('\n🌐 Available API Endpoints:');
    console.log('==========================');
    console.log('📝 POST /api/contact           - Submit contact form');
    console.log('📊 GET  /api/contacts          - Get contact submissions (admin)');
    console.log('🛠️  GET  /api/services          - Get all services');
    console.log('👥 GET  /api/team              - Get team members');
    console.log('📊 GET  /api/stats             - Get company statistics');
    console.log('⭐ GET  /api/testimonials      - Get testimonials');
    console.log('📰 POST /api/newsletter        - Subscribe to newsletter');
    console.log('🔍 GET  /api/health            - Health check');
}

function displayNextSteps() {
    console.log('\n🎯 Next Steps:');
    console.log('===============');
    console.log('1. Start the server: npm start (or npm run dev for development)');
    console.log('2. Visit: http://localhost:3000');
    console.log('3. Test the contact form on your website');
    console.log('4. Check API endpoints: http://localhost:3000/api/health');
    console.log('5. View contact submissions: http://localhost:3000/api/contacts');
    
    console.log('\n📚 Documentation:');
    console.log('- API Documentation: See API_Documentation.md');
    console.log('- Database Schema: See database_setup.sql');
    console.log('- Setup Guide: See README_SETUP.md');
}

async function main() {
    try {
        // Check environment
        const envOk = await checkEnvironment();
        if (!envOk) {
            process.exit(1);
        }
        
        // Test connection
        const connectionOk = await testSupabaseConnection();
        if (!connectionOk) {
            process.exit(1);
        }
        
        // Check database tables
        const tablesOk = await checkDatabaseTables();
        if (!tablesOk) {
            console.log('\n⚠️  Warning: Some database tables may not be set up correctly.');
            console.log('   The backend will still work for basic operations.');
        }
        
        // Display info
        await displayDatabaseInfo();
        displayEndpoints();
        displayNextSteps();
        
        console.log('\n🎉 Supabase backend setup complete!');
        console.log('🚀 Ready to start your Maximus Consultancy Services backend!');
        
    } catch (error) {
        console.error('\n💥 Setup failed:', error.message);
        process.exit(1);
    }
}

// Run setup
if (require.main === module) {
    main();
}

module.exports = {
    checkEnvironment,
    testSupabaseConnection,
    checkDatabaseTables
};
