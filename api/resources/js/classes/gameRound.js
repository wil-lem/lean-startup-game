export default class GameRound {
  constructor(featuresMap) {
    this.previousRound = null;
    this.roundNumber = 1;
    this.features = {
      A: 0,
      B: 0,
      C: 0,
    };
    this.featuresMap = featuresMap;
    this.clicks = 0;
  }

  getNumber() {
    return this.roundNumber;
  }

  developFeature(featureKey) {
    this.features[featureKey]++;
  }
  
  nextRound() {
    const newRound = new GameRound(this.featuresMap);
    newRound.previousRound = this;
    newRound.roundNumber = this.roundNumber + 1;
    return newRound;
  }

  clone() {
    const clone = new GameRound();
    clone.features = { ...this.features };
    return clone;
  }

  parseInventory(inventory) {
    for(const key in inventory) {
      switch (inventory[key].id) {
        case 'FA':
          this.developFeature('A');
          break;
        case 'FB':
          this.developFeature('B');
          break;
        case 'FC':
          this.developFeature('C');
          break;
        case 'C1':
          this.clicks += 1000;
          break;
        case 'C2':
          this.clicks += 5000;
          break;
        case 'C3':
          this.clicks += 10000;
          break;
        default:
          break;
        
      }
    }
  }

  getDevelopedFeatures() {
    return this.features;
  }

  getRetentionCustomers() {
    // =(H22)+G22+F22+E22+D22+C22+B22
    if(this.previousRound === null) {
      return 0;
    }
    return this.previousRound.getRetention() + this.previousRound.getRetentionCustomers();
  }

  getTotalVisitors() {
    // =I16+I18
    return this.clicks + this.getRetentionCustomers();
  }

  getLoggedIn() {
    // =(I17 *0.081) + (I29*7)
    const key = this.getRealFeatureKey('B');
    return (this.getTotalVisitors() * 0.081) + (this.getFeatureTotal(key) * 7);
  }

  getNewPayingCustomers() {
    //=I19*(0.05+(I30*0.05))
    const key = this.getRealFeatureKey('C');
    return this.getLoggedIn() * (0.05 + (this.getFeatureTotal(key) * 0.05));
  }

  // Graph 1
  getReferralSale() {
    // =I20*0.1
    return this.getNewPayingCustomers() * 0.1;
  }

  getRetention() {
    // =EXP(I28)*I21
    const key = this.getRealFeatureKey('A');
    return Math.exp(this.getFeatureTotal(key)) * this.getReferralSale();
  }

  getTotalCustomer(round,inventory) {
    // =I20+I21
    return this.getNewPayingCustomers() + this.getReferralSale();
  }

  getIncome(round,inventory) {
    // =(I22+I23)
    return this.getTotalCustomer() + this.getRetention();
  }

  getRealFeatureKey(featureKey) {
    const baseFeatures = ['A','B','C'];
    const index = baseFeatures.indexOf(featureKey);
    return this.featuresMap[index];
  }

  getFeatureTotal(featureKey) {
    let total = 0;
    if(this.previousRound !== null) {
      total += this.previousRound.getFeatureTotal(featureKey);
    }
    total += this.features[featureKey];
    return total;
  }
}