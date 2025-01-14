class FormLocker {
    constructor(formId) {
        this.form = $(`#${formId}`);
        this.isLocked = false;
        this.setupOverlay();
    }

    setupOverlay() {
        const overlay = `
            <div class="form-overlay">
                <div class="spinner-container">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <div class="spinner-text">Guardando...</div>
                </div>
            </div>`;
        
        this.form.wrap('<div class="form-container"></div>');
        this.form.parent().append(overlay);
        this.overlay = this.form.parent().find('.form-overlay');
    }

    lock() {
        this.isLocked = true;
        // this.form.find('input, select, textarea, button').prop('disabled', true);
        // this.form.find('.nav-tabs .nav-link').prop('disabled', true);
        this.overlay.addClass('active');
    }

    unlock() {
        this.isLocked = false;
        // this.form.find('input, select, textarea, button').prop('disabled', false);
        // this.form.find('.nav-tabs .nav-link').prop('disabled', false);
        this.overlay.removeClass('active');
    }

    isFormLocked() {
        return this.isLocked;
    }
}