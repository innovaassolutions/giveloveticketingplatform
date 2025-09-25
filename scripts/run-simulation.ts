import { simulator } from '../src/lib/simulation';

async function runSimulation() {
  try {
    console.log('🎭 Starting GiveLove Platform Simulation');
    console.log('=====================================\n');

    await simulator.runFullSimulation();

    console.log('\n✅ Simulation completed successfully!');
    console.log('🎯 The platform now has realistic demo data including:');
    console.log('   • Customer profiles based on real demographics');
    console.log('   • Purchase patterns reflecting price sensitivity');
    console.log('   • Charity uplift response modeling');
    console.log('   • AI-powered demand suggestions');
    console.log('   • Revenue analytics ready for dashboard\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Simulation failed:', error);
    process.exit(1);
  }
}

runSimulation();