import React, { useState } from 'react';

const AddListingForm = () => {
  // 1. Setup State: Manages the active step of the form
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  // 5. Navigation Handlers
  const nextStep = (e) => {
    e.preventDefault();
    // In a real app, form validation for the current step would occur here
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0); // Good UX practice to scroll to top on step change
    }
  };

  const prevStep = (e) => {
    e.preventDefault();
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  // Helper to render the Stepper component
  const renderStepper = () => (
    <ol className="stepper-list">
      {[1, 2, 3, 4, 5, 6].map((step) => (
        <li
          key={step}
          className={`border stepper-item ${currentStep === step ? 'active-step' : ''}`}
          aria-current={currentStep === step ? 'step' : undefined}
        >
          <span className="stepper-index">{step}</span>
          <span className="stepper-label">{
            step === 1 ? 'Details' :
            step === 2 ? 'Photos' :
            step === 3 ? 'Description' :
            step === 4 ? 'Pricing' :
            step === 5 ? 'Location' :
            'Review'
          }</span>
        </li>
      ))}
    </ol>
  );

  // 4. Step Logic: Conditionally render the correct fieldset
  const renderStepContent = (stepNum) => {
    // 3. Extract & Convert JSX: HTML converted to JSX
    switch (stepNum) {
      case 1:
        return (
          // Step 1: Basic Details
          <fieldset id="step-1" aria-labelledby="step1-title" role="group" data-step="1">
            <legend id="step1-title" className="step-1-legend">1. Basic Details</legend>
            <div className="step-1-grid">
              <div>
                <label htmlFor="title" className="label-title">Title</label>
                <input type="text" id="title" name="title" required aria-required="true" aria-describedby="title-error" placeholder="e.g., Introduction to Algorithms" className="form-input" />
                <small id="title-error" role="alert" className="error-title">Please enter a title.</small>
              </div>
              <div>
                <label htmlFor="author" className="label-author">Author</label>
                <input type="text" id="author" name="author" required aria-required="true" aria-describedby="author-error" placeholder="e.g., Cormen, Leiserson" className="form-input" />
                <small id="author-error" role="alert" className="error-author">Please enter an author.</small>
              </div>
              <div>
                <label htmlFor="subject" className="label-subject">Subject</label>
                <input type="text" id="subject" name="subject" aria-describedby="subject-hint" placeholder="e.g., Computer Science" className="form-input" />
                <small id="subject-hint" className="hint-subject">Optional, helps pricing suggestions.</small>
              </div>
              <div>
                <label htmlFor="course" className="label-course">Course</label>
                <input type="text" id="course" name="course" placeholder="e.g., CS 101" className="form-input" />
              </div>
              <div>
                <label htmlFor="edition" className="label-edition">Edition</label>
                <input type="text" id="edition" name="edition" inputMode="numeric" pattern="[0-9]*" placeholder="e.g., 3" className="form-input" />
              </div>
              <div>
                <label htmlFor="condition" className="label-condition">Condition</label>
                <select id="condition" name="condition" required aria-required="true" aria-describedby="condition-error" className="form-input">
                  <option value="">Select condition</option>
                  <option value="new">New</option>
                  <option value="like-new">Like New</option>
                  <option value="good">Good</option>
                  <option value="acceptable">Acceptable</option>
                </select>
                <small id="condition-error" role="alert" className="error-condition">Please select a condition.</small>
              </div>
            </div>
            <div className="price-type-group">
              <span id="priceTypeLabel" className="price-type-label">Listing type</span>
              <div role="radiogroup" aria-labelledby="priceTypeLabel" className="price-type-radios">
                <label className="radio-label">
                  <input type="radio" name="priceType" defaultValue="sell" defaultChecked className="radio-control" />
                  <span className="radio-text">Sell</span>
                </label>
                <label className="radio-label">
                  <input type="radio" name="priceType" defaultValue="exchange" className="radio-control" />
                  <span className="radio-text">Exchange</span>
                </label>
                <label className="radio-label">
                  <input type="radio" name="priceType" defaultValue="donate" className="radio-control" />
                  <span className="radio-text">Donate</span>
                </label>
              </div>
            </div>
              <div className="step-nav-row">
                <div aria-hidden="true" className="step-hint">Step {currentStep} of {totalSteps}</div>
                <div className="step-buttons">
                  <button type="button" onClick={nextStep} className="btn-primary next-button">Next</button>
                </div>
              </div>
        </fieldset>
      );
      case 2:
        return (
          // Step 2: Photos
          <fieldset id="step-2" aria-labelledby="step2-title" role="group" data-step="2">
            <legend id="step2-title" className="step-2-legend">2. Photos</legend>
            <div className="photo-upload-grid">
          <div className="border upload-area-card">
                <div id="dropzone" tabIndex="0" role="button" aria-label="Upload book photos" className="dropzone">
                  <img src="https://api.iconify.design/lucide-upload-cloud.svg" width="28" height="28" alt="" loading="lazy" aria-hidden="true" />
                  <p className="dropzone-title">Drag &amp; drop photos here</p>
                  <p className="dropzone-subtitle">or</p>
                  <div className="upload-buttons-row">
<label className="btn-primary device-upload-label">
                      <input type="file" id="fileInput" accept="image/*" multiple className="file-input" />
                      <span>Choose from device</span>
                    </label>
                    <button type="button" id="cloudinaryBtn" className="cloudinary-button">Upload via Cloudinary</button>
                  </div>
                  <small className="optimization-hint">Images are optimized automatically for faster loading.</small>
                  <div id="cloudinaryConfig" data-cloud-name="" data-upload-preset="" className="cloudinary-config-holder"></div>
                </div>
              </div>
              <div className="border upload-tips-card">
                <h3 className="upload-tips-title">Tips</h3>
                <ul className="upload-tips-list">
                  <li>Include cover, spine, and a page sample.</li>
                  <li>Good lighting and in-focus photos help buyers.</li>
                  <li>Max 8 images, 10MB each.</li>
                </ul>
              </div>
            </div>
            <div id="previewGrid" aria-live="polite" className="preview-grid"></div>
            <div className="step-nav-row">
              <div className="step-hint">Step {currentStep} of {totalSteps}</div>
              <div className="step-buttons">
<button type="button" onClick={prevStep} className="btn-secondary previous-button">Back</button>
<button type="button" onClick={nextStep} className="btn-primary next-button">Next</button>
              </div>
            </div>
          </fieldset>
        );
      case 3:
        return (
          // Step 3: Description & ISBN
          <fieldset id="step-3" aria-labelledby="step3-title" role="group" data-step="3">
            <legend id="step3-title" className="step-3-legend">3. Description &amp; ISBN</legend>
            <div className="step-3-grid">
              <div>
                <label htmlFor="description" className="label-description">Description</label>
                <textarea id="description" name="description" rows="6" placeholder="Note highlights, markings, or included access codes." className="form-input" />
                <small className="hint-description">Helpful, but optional.</small>
              </div>
              <div>
                <label htmlFor="isbn" className="label-isbn">ISBN / Barcode</label>
                <div className="isbn-row">
                  <input type="text" id="isbn" name="isbn" inputMode="numeric" pattern="[0-9Xx\-]*" placeholder="e.g., 9780262033848" aria-describedby="isbn-hint" className="form-input" />
                  <button type="button" id="scanBtn" className="scan-button">
                    <img src="https://api.iconify.design/lucide-camera.svg" width="18" height="18" alt="Camera icon" loading="lazy" aria-hidden="true" />
                    <span>Scan</span>
                  </button>
                </div>
                <small id="isbn-hint" className="hint-isbn">Use your camera to scan the barcode on the back cover.</small>
                <div id="scanner" aria-hidden="true" className="border scanner-container hidden">
                  <video allowFullScreen="allowfullscreen" id="video" playsInline muted className="scanner-video" controls />
                  <div className="scanner-controls-row">
                    <span id="scanStatus" className="scanner-status">Initializing camera…</span>
                    <button type="button" id="closeScanBtn" className="scanner-close-button">Close</button>
                  </div>
                </div>
              </div>
            </div>
          <div className="step-nav-row">
            <div className="step-hint">Step {currentStep} of {totalSteps}</div>
            <div className="step-buttons">
              <button type="button" onClick={prevStep} className="btn-secondary previous-button">Back</button>
              <button type="button" onClick={nextStep} className="btn-primary next-button">Next</button>
            </div>
          </div>
          </fieldset>
        );
      case 4:
        return (
          // Step 4: Pricing
          <fieldset id="step-4" aria-labelledby="step4-title" role="group" data-step="4">
            <legend id="step4-title" className="step-4-legend">4. Pricing</legend>
            <div className="pricing-grid">
              <div>
                <label htmlFor="price" className="label-price">Price</label>
                <div className="price-input-wrapper">
                  <span aria-hidden="true" className="currency-prefix">$</span>
                  <input type="number" id="price" name="price" step="0.01" min="0" inputMode="decimal" aria-describedby="price-help price-error price-sr" placeholder="e.g., 35.00" className="form-input" />
                  <button type="button" id="priceInfoBtn" aria-expanded="false" aria-controls="price-tooltip" className="price-info-button">
                    <img src="https://api.iconify.design/lucide-help-circle.svg" width="18" height="18" alt="Pricing guidance" loading="lazy" />
                  </button>
                </div>
                <small id="price-help" className="help-price">If exchanging or donating, you can leave this empty.</small>
                <small id="price-error" role="alert" className="error-price">Enter a valid price.</small>
                <span id="price-sr" aria-live="polite" className="price-live-region"></span>
              </div>
              <div className="border suggestion-card">
                <h3 className="suggestion-title">Suggested price</h3>
                <p id="suggestedPrice" className="suggestion-value">$—</p>
                <p className="suggestion-note">Based on market trends, condition, and edition.</p>
                <div id="price-tooltip" role="dialog" aria-label="Pricing guidance" className="tooltip-panel hidden">
                  <p className="tooltip-title">How we estimate</p>
                  <ul className="tooltip-list">
                    <li>Recent campus listings</li>
                    <li>Condition multiplier</li>
                    <li>Edition depreciation</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="step-nav-row">
              <div className="step-hint">Step {currentStep} of {totalSteps}</div>
              <div className="step-buttons">
                <button type="button" onClick={prevStep} className="btn-secondary previous-button">Back</button>
                <button type="button" onClick={nextStep} className="btn-primary next-button">Next</button>
              </div>
            </div>
          </fieldset>
        );
      case 5:
        return (
          // Step 5: Location
          <fieldset id="step-5" aria-labelledby="step5-title" role="group" data-step="5">
            <legend id="step5-title" className="step-5-legend">5. Location</legend>
            <div className="location-grid">
              <div className="border zone-picker-card">
                <h3 className="zone-picker-title">Select campus zone</h3>
                <div role="radiogroup" aria-labelledby="zoneLabel" className="zone-radio-group">
                  <span id="zoneLabel" className="zone-label">Campus zone</span>
                  <label className="zone-radio-label">
                    <input type="radio" name="zone" defaultValue="Main Library" defaultChecked className="zone-radio-control" />
                    <span className="zone-radio-text">Main Library</span>
                  </label>
                  <label className="zone-radio-label">
                    <input type="radio" name="zone" defaultValue="North Campus" className="zone-radio-control" />
                    <span className="zone-radio-text">North Campus</span>
                  </label>
                  <label className="zone-radio-label">
                    <input type="radio" name="zone" defaultValue="Student Center" className="zone-radio-control" />
                    <span className="zone-radio-text">Student Center</span>
                  </label>
                  <label className="zone-radio-label">
                    <input type="radio" name="zone" defaultValue="Engineering Quad" className="zone-radio-control" />
                    <span className="zone-radio-text">Engineering Quad</span>
                  </label>
                </div>
                <div className="location-notes">
                  <label htmlFor="meetNotes" className="label-meet-notes">Meetup details</label>
                  <input type="text" id="meetNotes" name="meetNotes" placeholder="e.g., 2nd floor by info desk" className="form-input" />
                </div>
              </div>
              <div className="border map-card">
                <div className="map-header">
                  <div className="map-header-left">
                    <img src="https://api.iconify.design/lucide-map-pin.svg" width="18" height="18" alt="" loading="lazy" aria-hidden="true" />
                    <span className="map-title">Campus Map</span>
                  </div>
                  <span id="mapZoneLabel" className="map-zone-label">Main Library</span>
                </div>
                <div className="map-frame-wrapper">
                  <iframe frameBorder="0" id="mapFrame" title="Google Map campus zone" loading="lazy" src="https://www.google.com/maps?output=embed&q=Main%20Library" className="map-iframe" />
                </div>
              </div>
            </div>
          <div className="step-nav-row">
            <div className="step-hint">Step {currentStep} of {totalSteps}</div>
            <div className="step-buttons">
              <button type="button" onClick={prevStep} className="btn-secondary previous-button">Back</button>
              <button type="button" onClick={nextStep} className="btn-primary next-button">Next</button>
            </div>
          </div>
          </fieldset>
        );
      case 6:
        return (
          // Step 6: Review & Submit
          <fieldset id="step-6" aria-labelledby="step6-title" role="group" data-step="6">
            <legend id="step6-title" className="step-6-legend">6. Review &amp; submit</legend>
            <div className="review-grid">
              <div className="border review-summary-card">
                <h3 className="review-title">Summary</h3>
                <dl className="summary-list">
                  <div className="summary-group"><dt className="summary-term">Title</dt><dd id="reviewTitle">—</dd></div>
                  <div className="summary-group"><dt className="summary-term">Author</dt><dd id="reviewAuthor">—</dd></div>
                  <div className="summary-group"><dt className="summary-term">Subject</dt><dd id="reviewSubject">—</dd></div>
                  <div className="summary-group"><dt className="summary-term">Course</dt><dd id="reviewCourse">—</dd></div>
                  <div className="summary-group"><dt className="summary-term">Edition</dt><dd id="reviewEdition">—</dd></div>
                  <div className="summary-group"><dt className="summary-term">Condition</dt><dd id="reviewCondition">—</dd></div>
                  <div className="summary-group"><dt className="summary-term">Type</dt><dd id="reviewType">—</dd></div>
                  <div className="summary-group"><dt className="summary-term">Price</dt><dd id="reviewPrice">—</dd></div>
                  <div className="summary-group"><dt className="summary-term">ISBN</dt><dd id="reviewISBN">—</dd></div>
                  <div className="summary-group"><dt className="summary-term">Location</dt><dd id="reviewLocation">—</dd></div>
                </dl>
              </div>
              <div className="border finalize-card">
                <div className="donate-row">
                  <input type="checkbox" id="donateCharity" name="donateCharity" aria-describedby="donateHint" className="donate-checkbox" />
                  <div>
                    <label htmlFor="donateCharity" className="donate-label">Donate 5% to campus charity</label>
                    <p id="donateHint" className="donate-hint">We’ll add an eco-impact badge to your listing.</p>
                  </div>
                </div>
                <div id="ecoBadge" className="eco-badge hidden">
                  <img src="https://api.iconify.design/lucide-leaf.svg" width="18" height="18" alt="" loading="lazy" aria-hidden="true" />
                  <span className="eco-text">Eco badge enabled — thank you!</span>
                </div>
                <div className="actions-row">
                  <button type="button" onClick={prevStep} className="btn-secondary previous-button">Back</button>
<button type="submit" className="btn-primary submit-button">Submit listing</button>
                </div>
                <p id="submitStatus" role="status" className="submit-status hidden">Submitting…</p>
              </div>
            </div>
          </fieldset>
        );
      default:
        return null;
    }
  };

  return (
    <main className="main-content">
      <section className="hero-section">
        <div className="hero-container">
          <div>
            <h1 className="h1 hero-title">List your textbook in minutes</h1>
            <p className="hero-subtitle">A guided, accessible multi-step form to help you sell, exchange, or donate books on campus.</p>
          </div>
          <div className="hero-assurance-group">
            <img src="https://api.iconify.design/lucide-shield-check.svg" width="20" height="20" alt="Shield check icon" loading="lazy" aria-hidden="true" />
            <span className="assurance-text">Your photos are optimized and uploads are secure.</span>
          </div>
        </div>
      </section>

      <section aria-label="Form Progress" className="stepper-section">
        {renderStepper()}
      </section>

      <section className="border form-wrapper">
        <div id="global-status" aria-live="polite" className="global-status-live-region"></div>
        {/* Note: The onSubmit should be attached to the final button for full control, but we keep the form element here for structure */}
        <form id="listingForm" noValidate aria-labelledby="form-title" onSubmit={(e) => { e.preventDefault(); console.log('Form submitted'); }}>
          <h2 id="form-title" className="h2 form-heading">Book Listing Form</h2>
          {renderStepContent(currentStep)}
        </form>
      </section>

      <section aria-label="Helpful Links" className="post-form-links-section">
        <div className="helpful-links-row">
          <a href="/" className="text-link helpful-link">Browse listings</a>
          <a href="/browse" className="text-link helpful-link">Find by course</a>
        </div>
      </section>
    </main>
  );
};

export default AddListingForm;
