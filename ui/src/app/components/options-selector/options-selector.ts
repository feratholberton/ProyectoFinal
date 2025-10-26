import { Component, inject, signal, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConsultationService, Opcion, ConsultationResponse } from '../../services/consultation.service';

@Component({
  selector: 'app-options-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './options-selector.html',
  styleUrl: './options-selector.css'
})
export class OptionsSelector {
  private consultationService = inject(ConsultationService);
  
  // Input from parent component (if needed)
  consultationData = input<ConsultationResponse | null>(null);
  
  // Output event when data is successfully submitted (emit patientID to trigger next step)
  dataSubmitted = output<string>();
  
  patientID = signal('');
  pasoActual = signal('');
  opciones = signal<Opcion[]>([]);
  previousSelections = signal<Opcion[]>([]); // Store previous selections
  additional = signal('');
  isLoading = signal(false);
  error = signal<string | null>(null);
  stepCounter = signal(0); // Force re-render on step change
  
  // Method to load consultation response data
  loadData(data: ConsultationResponse) {
    console.log('OptionsSelector.loadData called with:', data);
    this.patientID.set(data.patientID);
    this.pasoActual.set(data.pasoActual);
    this.opciones.set([...data.opciones]);
    this.error.set(null);
    console.log('OptionsSelector state after load:', {
      patientID: this.patientID(),
      pasoActual: this.pasoActual(),
      opciones: this.opciones(),
      hasData: this.hasData()
    });
  }

  toggleOption(index: number) {
    const options = [...this.opciones()];
    options[index].checked = !options[index].checked;
    this.opciones.set(options);
  }

  updateAdditional(value: string) {
    this.additional.set(value);
  }

  getSelectedOptions(): string[] {
    return this.opciones()
      .filter(option => option.checked)
      .map(option => option.label);
  }

  onSubmit() {
    console.log('🚀 onSubmit() called!');
    const selectedOptions = this.getSelectedOptions();
    console.log('🚀 Selected options:', selectedOptions);
    
    if (selectedOptions.length === 0) {
      this.error.set('Por favor, seleccione al menos una opción');
      console.log('⚠️ No options selected, returning');
      return;
    }

    console.log('🚀 Starting flow with patientID:', this.patientID());
    this.isLoading.set(true);
    this.error.set(null);

    const currentPatientID = this.patientID();

    this.consultationService.collectData(
      currentPatientID,
      selectedOptions,
      this.additional()
    ).subscribe({
      next: (collectResult) => {
        console.log('✓ Step 1: Data collected successfully:', collectResult);
        
        // Step 2: Get consulta to see previous selections
        this.consultationService.getConsulta(currentPatientID).subscribe({
          next: (consultaResult) => {
            console.log('✓ Step 2: Consulta result:', consultaResult);
            console.log('  - pasoActual:', consultaResult.pasoActual);
            console.log('  - previous opciones count:', consultaResult.partialState.opciones.length);
            
            // CRITICAL: Clear current options FIRST before loading new data
            console.log('⚠️ CLEARING old opciones before loading new step');
            this.opciones.set([]);
            this.stepCounter.update(c => c + 1); // Increment step counter to force re-render
            
            // Store previous selections
            this.previousSelections.set([...consultaResult.partialState.opciones]);
            this.pasoActual.set(consultaResult.pasoActual);
            
            console.log('⚠️ Updated state:', {
              pasoActual: this.pasoActual(),
              previousSelectionsCount: this.previousSelections().length,
              opcionesCount: this.opciones().length
            });
            
            // Step 3: Get new generator options
            this.consultationService.getGenerator(currentPatientID).subscribe({
              next: (generatorResult) => {
                console.log('✓ Step 3: Generator result:', generatorResult);
                console.log('  - new opciones count:', generatorResult.opciones.length);
                console.log('  - first 3 opciones:', generatorResult.opciones.slice(0, 3));
                
                // CRITICAL: Create completely NEW array with NEW objects
                console.log('⚠️ Creating NEW opciones array');
                const newOpciones = generatorResult.opciones.map((opt, idx) => ({
                  label: opt.label,
                  checked: opt.checked,
                  _id: `${consultaResult.pasoActual}-${idx}` // Add unique ID
                }));
                
                console.log('⚠️ Setting NEW opciones. Before set:', this.opciones().length);
                this.opciones.set(newOpciones);
                this.stepCounter.update(c => c + 1); // Increment again after setting new options
                console.log('⚠️ After set:', this.opciones().length);
                console.log('⚠️ Step counter:', this.stepCounter());
                console.log('⚠️ New opciones sample:', this.opciones().slice(0, 2));
                
                this.additional.set('');
                this.isLoading.set(false);
                this.error.set(null);
                
                console.log('✓ All done! Current state:', {
                  opcionesLength: this.opciones().length,
                  hasData: this.hasData(),
                  pasoActual: this.pasoActual(),
                  previousSelectionsLength: this.previousSelections().length,
                  firstOpcion: this.opciones()[0]
                });
                
                // Emit patientID to trigger the next step component
                this.dataSubmitted.emit(currentPatientID);
              },
              error: (err) => {
                console.error('✗ Error getting generator options:', err);
                this.error.set('Error al obtener las nuevas opciones. Por favor, intente nuevamente.');
                this.isLoading.set(false);
              }
            });
          },
          error: (err) => {
            console.error('✗ Error getting consulta:', err);
            this.error.set('Error al obtener el estado de la consulta. Por favor, intente nuevamente.');
            this.isLoading.set(false);
          }
        });
      },
      error: (err) => {
        console.error('✗ Error collecting data:', err);
        this.error.set('Error al enviar los datos. Por favor, intente nuevamente.');
        this.isLoading.set(false);
      }
    });
  }

  hasData(): boolean {
    return this.opciones().length > 0;
  }

  // Debug method - can be called from template
  testConsultaFlow() {
    const pid = this.patientID();
    console.log('🔍 Testing consulta flow for patient:', pid);
    
    this.consultationService.getConsulta(pid).subscribe({
      next: (result) => {
        console.log('🔍 Consulta test result:', result);
        console.log('🔍 Previous opciones:', result.partialState.opciones);
        // Update state
        this.previousSelections.set([...result.partialState.opciones]);
        this.pasoActual.set(result.pasoActual);
      },
      error: (err) => {
        console.error('🔍 Consulta test error:', err);
      }
    });
  }

  testGeneratorFlow() {
    const pid = this.patientID();
    console.log('🔍 Testing generator flow for patient:', pid);
    
    this.consultationService.getGenerator(pid).subscribe({
      next: (result) => {
        console.log('🔍 Generator test result:', result);
        console.log('🔍 New opciones count:', result.opciones.length);
        console.log('🔍 New opciones:', result.opciones);
        
        // Update state - create new array
        const newOpciones = result.opciones.map(opt => ({
          label: opt.label,
          checked: opt.checked
        }));
        
        console.log('🔍 Setting opciones to:', newOpciones);
        this.opciones.set(newOpciones);
        
        console.log('🔍 After set - opciones().length:', this.opciones().length);
        console.log('🔍 After set - hasData():', this.hasData());
      },
      error: (err) => {
        console.error('🔍 Generator test error:', err);
      }
    });
  }

  // Add a full test that does both
  testFullFlow() {
    const pid = this.patientID();
    console.log('🔍🔍🔍 Testing FULL flow for patient:', pid);
    
    this.consultationService.getConsulta(pid).subscribe({
      next: (consultaResult) => {
        console.log('🔍 Step 1 - Consulta result:', consultaResult);
        this.previousSelections.set([...consultaResult.partialState.opciones]);
        this.pasoActual.set(consultaResult.pasoActual);
        
        this.consultationService.getGenerator(pid).subscribe({
          next: (generatorResult) => {
            console.log('🔍 Step 2 - Generator result:', generatorResult);
            const newOpciones = generatorResult.opciones.map(opt => ({
              label: opt.label,
              checked: opt.checked
            }));
            this.opciones.set(newOpciones);
            console.log('🔍 FULL FLOW COMPLETE - Check screen now!');
          },
          error: (err) => console.error('🔍 Generator error:', err)
        });
      },
      error: (err) => console.error('🔍 Consulta error:', err)
    });
  }
}
