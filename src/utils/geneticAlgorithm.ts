import type { 
  ClimberProfile, 
  TrainingWeek, 
  TrainingDay, 
  TrainingSession, 
  Exercise,
  ExerciseFactory,
  ProgressionCalculator
} from '../types/training';

export class GeneticConfig {
  constructor(config: Partial<GeneticConfig> = {}) {
    this.populationSize = config.populationSize || 100;
    this.initialPopulationSize = config.initialPopulationSize || this.populationSize * 2;
    this.elitismCount = config.elitismCount || Math.max(1, Math.floor(this.populationSize * 0.05));
    this.mutationRate = config.mutationRate || 0.05;
    this.mutationPower = config.mutationPower || 0.1;
    this.crossoverRate = config.crossoverRate || 0.8;
    this.maxGenerations = config.maxGenerations || 100;
    this.tournamentSize = config.tournamentSize || 3;
    this.tournamentProbability = config.tournamentProbability || 0.75;
    this.fitnessThreshold = config.fitnessThreshold || 0;
    this.maxGenerationsWithoutImprovement = config.maxGenerationsWithoutImprovement || 20;
    this.fitnessConvergenceThreshold = config.fitnessConvergenceThreshold || 0.01;
    this.maxExecutionTimeMs = config.maxExecutionTimeMs || 30000;
    this.parallelWorkers = config.parallelWorkers || 1;
    this.loggingEnabled = config.loggingEnabled !== undefined ? config.loggingEnabled : true;
    this.logInterval = config.logInterval || 10;
    this.verboseLogging = config.verboseLogging || false;
  }

  populationSize: number;
  initialPopulationSize: number;
  elitismCount: number;
  mutationRate: number;
  mutationPower: number;
  crossoverRate: number;
  maxGenerations: number;
  tournamentSize: number;
  tournamentProbability: number;
  fitnessThreshold: number;
  maxGenerationsWithoutImprovement: number;
  fitnessConvergenceThreshold: number;
  maxExecutionTimeMs: number;
  parallelWorkers: number;
  loggingEnabled: boolean;
  logInterval: number;
  verboseLogging: boolean;

  validate(): void {
    if (this.populationSize < 10) {
      throw new Error('Population size must be at least 10');
    }
    if (this.elitismCount >= this.populationSize) {
      throw new Error('Elitism count must be less than population size');
    }
    if (this.mutationRate < 0 || this.mutationRate > 1) {
      throw new Error('Mutation rate must be between 0 and 1');
    }
    if (this.crossoverRate < 0 || this.crossoverRate > 1) {
      throw new Error('Crossover rate must be between 0 and 1');
    }
    if (this.tournamentSize < 2) {
      throw new Error('Tournament size must be at least 2');
    }
    if (this.tournamentProbability <= 0.5 || this.tournamentProbability > 1) {
      throw new Error('Tournament probability must be > 0.5 and <= 1');
    }
  }

  static explorationConfig(baseConfig: Partial<GeneticConfig> = {}): GeneticConfig {
    return new GeneticConfig({
      ...baseConfig,
      populationSize: (baseConfig.populationSize || 100) * 1.5,
      mutationRate: Math.min(1, (baseConfig.mutationRate || 0.05) * 2),
      tournamentSize: Math.max(2, Math.floor((baseConfig.tournamentSize || 3) * 0.7)),
      elitismCount: Math.max(1, Math.floor((baseConfig.elitismCount || 5) * 0.5))
    });
  }

  static exploitationConfig(baseConfig: Partial<GeneticConfig> = {}): GeneticConfig {
    return new GeneticConfig({
      ...baseConfig,
      populationSize: (baseConfig.populationSize || 100) * 0.8,
      mutationRate: (baseConfig.mutationRate || 0.05) * 0.5,
      tournamentSize: Math.floor((baseConfig.tournamentSize || 3) * 1.5),
      elitismCount: Math.floor((baseConfig.elitismCount || 5) * 1.5)
    });
  }
}

export class GeneticIndividual {
  fitness: number = 0;
  normalizedFitness: number = 0;
  rank: number = 0;
  age: number = 0;
  parents: string[] = [];
  id: string = Math.random().toString(36).substring(2, 15);

  calculateFitness(): number {
    throw new Error('calculateFitness method must be implemented by child class');
  }

  crossover(other: GeneticIndividual): GeneticIndividual {
    throw new Error('crossover method must be implemented by child class');
  }

  mutate(mutationRate: number, mutationPower: number): void {
    throw new Error('mutate method must be implemented by child class');
  }

  clone(): GeneticIndividual {
    const clone = Object.create(Object.getPrototypeOf(this));
    for (const [key, value] of Object.entries(this)) {
      if (key === 'parents') {
        clone[key] = [...this.parents];
      } else if (key === 'id') {
        clone[key] = Math.random().toString(36).substring(2, 15);
      } else if (Array.isArray(value)) {
        clone[key] = [...value];
      } else if (value instanceof Object) {
        clone[key] = {...value};
      } else {
        clone[key] = value;
      }
    }
    return clone;
  }

  compareTo(other: GeneticIndividual): number {
    if (this.fitness > other.fitness) return 1;
    if (this.fitness < other.fitness) return -1;
    return 0;
  }

  toString(): string {
    return `Individual ${this.id.substring(0, 6)}: Fitness = ${this.fitness.toFixed(2)}`;
  }
}

export class ClimbingScheduleIndividual extends GeneticIndividual {
  private chromosome: number[][] = [];
  private days: TrainingDay[] = [];

  constructor(
    private profile: ClimberProfile,
    private weekNumber: number,
    private exerciseFactory: ExerciseFactory,
    private progression: ProgressionCalculator
  ) {
    super();
    this.initializeSchedule();
  }

  private initializeSchedule(): void {
    // Initialize days array
    this.days = Array(7).fill(null).map((_, i) => ({
      isRest: !this.profile.availableDays[i],
      sessions: []
    }));

    // Initialize chromosome
    this.chromosome = Array(7).fill(null).map((_, dayIndex) => {
      if (!this.profile.availableDays[dayIndex]) {
        return Array(10).fill(0);
      }
      const dayGenes = Array(10).fill(0);
      dayGenes[0] = 1; // Warmup is always scheduled
      return dayGenes;
    });

    this.randomizeSchedule();
    this.calculateFitness();
  }

  private randomizeSchedule(): void {
    // Implementation of schedule randomization
    // This would be similar to the original code but adapted for TypeScript
  }

  calculateFitness(): number {
    // Implementation of fitness calculation
    // This would be similar to the original code but adapted for TypeScript
    return 0; // Placeholder
  }

  crossover(other: ClimbingScheduleIndividual): ClimbingScheduleIndividual {
    // Implementation of crossover
    // This would be similar to the original code but adapted for TypeScript
    return this; // Placeholder
  }

  mutate(mutationRate: number, mutationPower: number): void {
    // Implementation of mutation
    // This would be similar to the original code but adapted for TypeScript
  }
}

export class GeneticAlgorithm {
  private population: GeneticIndividual[] = [];
  private bestIndividual: GeneticIndividual | null = null;
  private isRunning: boolean = false;
  private generationsSinceImprovement: number = 0;
  private bestFitnessSoFar: number = -Infinity;

  constructor(
    private IndividualClass: new (...args: any[]) => GeneticIndividual,
    private config: GeneticConfig
  ) {}

  run(): GeneticIndividual {
    // Implementation of genetic algorithm
    // This would be similar to the original code but adapted for TypeScript
    return this.bestIndividual!;
  }
} 