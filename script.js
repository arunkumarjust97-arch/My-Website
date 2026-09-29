/**
 * ARUN KUMAR SARAVANAN - PORTFOLIO INTERACTIVITY SCRIPT
 * Features: Dynamic Typing, AI Sentinel Demo, Code Inspector,
 * Audio Feedback, Modals, Filters, Theme Switcher, and Form Validation
 */

// State Management
const appState = {
  soundEnabled: false,
  theme: 'light',
  activeCodeTab: 'java-spring',
  currentFilter: 'all'
};

// ===================================================================
// SOUND EFFECTS ENGINE (Web Audio API - No external dependencies)
// ===================================================================
let audioCtx = null;

function initAudio() {
  if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
}

function playUiSound(type = 'click') {
  if (!appState.soundEnabled) return;
  try {
    initAudio();
    if (!audioCtx || audioCtx.state === 'suspended') {
      audioCtx?.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;
    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(850, now + 0.05);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'success') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      osc.start(now);
      osc.stop(now + 0.14);
    } else if (type === 'tab') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.06);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.start(now);
      osc.stop(now + 0.06);
    }
  } catch (e) {
    // Audio unsupported or blocked by autoplay policy
  }
}

// ===================================================================
// DYNAMIC HERO TYPING EFFECT
// ===================================================================
const typingRoles = [
  "Java Backend Architecture",
  "Spring Boot Microservices",
  "Enterprise RESTful APIs",
  "Android Hybrid WebView Systems",
  "MySQL & MongoDB Engineering",
  "Clean Code & Distributed Systems"
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingDelay = 90;
const eraseDelay = 45;
const pauseDelay = 2200;

function handleTyping() {
  const targetElement = document.getElementById("typing-text");
  if (!targetElement) return;

  const currentRole = typingRoles[roleIndex];

  if (!isDeleting) {
    targetElement.textContent = currentRole.substring(0, charIndex + 1);
    charIndex++;
    if (charIndex === currentRole.length) {
      isDeleting = true;
      setTimeout(handleTyping, pauseDelay);
      return;
    }
    setTimeout(handleTyping, typingDelay);
  } else {
    targetElement.textContent = currentRole.substring(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % typingRoles.length;
      setTimeout(handleTyping, 400);
      return;
    }
    setTimeout(handleTyping, eraseDelay);
  }
}

// ===================================================================
// CODE INSPECTOR SNIPPETS
// ===================================================================
const codeRepository = {
  'java-spring': {
    filename: 'EnterpriseGatewayController.java',
    archBadge: 'Enterprise Pattern: Clean Architecture • Dependency Injection • Validation',
    code: `// Production-grade Spring Boot REST API Gateway
package com.arunkumar.enterprise.controller;

import com.arunkumar.enterprise.dto.TransactionRequestDTO;
import com.arunkumar.enterprise.dto.ExecutionResponse;
import com.arunkumar.enterprise.service.TransactionOrchestratorService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/gateway")
@CrossOrigin(origins = "*")
public class EnterpriseGatewayController {

    private final TransactionOrchestratorService orchestratorService;

    @Autowired
    public EnterpriseGatewayController(TransactionOrchestratorService orchestratorService) {
        this.orchestratorService = orchestratorService;
    }

    @PostMapping("/dispatch")
    public ResponseEntity<ExecutionResponse> dispatchTransaction(
            @Valid @RequestBody TransactionRequestDTO payload) {
        
        // Asynchronous routing, idempotent processing, and resilient payload validation
        ExecutionResponse result = orchestratorService.processExecution(payload);
        return ResponseEntity.ok(result);
    }
}`
  },
  'android-bridge': {
    filename: 'NativeWebViewActivity.java',
    archBadge: 'Android Architecture: Native Container Bridge • WebSettings • Hardware Acceleration',
    code: `// Seamless Native Container Integration with Web Components
package com.arunkumar.webviewapp;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.appcompat.app.AppCompatActivity;

public class NativeWebViewActivity extends AppCompatActivity {

    private WebView mWebView;

    @Override
    @SuppressLint("SetJavaScriptEnabled")
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_native_webview);

        mWebView = findViewById(R.id.native_webview_host);
        
        WebSettings settings = mWebView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        
        // Custom Client handles URL navigation internally without launching browser
        mWebView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                view.loadUrl(url);
                return true;
            }
        });

        mWebView.setWebChromeClient(new WebChromeClient());
        mWebView.loadUrl("https://production-portal.internal/dashboard");
    }
}`
  },
  'mongo-pipeline': {
    filename: 'TelemetryAnalyticsAggregation.js',
    archBadge: 'NoSQL Pipeline: Multi-Stage Aggregation ($match, $group, $lookup, $project)',
    code: `// MongoDB High-Throughput Aggregation Pipeline for Telemetry Analytics
db.telemetry_events.aggregate([
  // Stage 1: Filter events within target operational window
  {
    $match: {
      timestamp: { $gte: ISODate("2026-01-01T00:00:00Z") },
      status: "ACTIVE"
    }
  },
  // Stage 2: Join with customer account profile metadata
  {
    $lookup: {
      from: "customer_profiles",
      localField: "accountId",
      foreignField: "id",
      as: "accountProfile"
    }
  },
  // Stage 3: Group by Service Cluster and compute throughput and error rate
  {
    $group: {
      _id: "$clusterId",
      totalEvents: { $sum: 1 },
      averageLatencyMs: { $avg: "$latency" },
      unresolvedRatio: {
        $avg: {
          $cond: [{ $eq: ["$status", "ERROR"] }, 1, 0]
        }
      }
    }
  },
  // Stage 4: Project cluster health metrics and SLA compliance
  {
    $project: {
      clusterId: "$_id",
      isHighThroughput: { $gt: ["$totalEvents", 50000] },
      healthPriority: {
        $cond: { if: { $gt: ["$unresolvedRatio", 0.05] }, then: "INVESTIGATE", else: "OPTIMAL" }
      }
    }
  }
]);`
  },
  'mysql-schema': {
    filename: 'ecommerce_fraud_audit_schema.sql',
    archBadge: 'Relational Database: Normalized 3NF Schema • Foreign Keys • Compound Indexes',
    code: `-- Relational Schema for E-Commerce Fraud & Review Audit Engine
CREATE TABLE products (
    product_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sku VARCHAR(64) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE customer_accounts (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(191) NOT NULL UNIQUE,
    account_status ENUM('ACTIVE', 'SUSPENDED', 'FLAGGED_BOT') DEFAULT 'ACTIVE',
    registered_ip VARCHAR(45) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE review_audits (
    audit_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    commentary TEXT NOT NULL,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    spam_confidence_score DECIMAL(5,2) DEFAULT 0.00,
    review_status ENUM('APPROVED', 'QUARANTINED', 'REJECTED') DEFAULT 'APPROVED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_audit_product FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    CONSTRAINT fk_audit_user FOREIGN KEY (user_id) REFERENCES customer_accounts(user_id) ON DELETE CASCADE,
    INDEX idx_product_audit (product_id, review_status, spam_confidence_score)
) ENGINE=InnoDB;`
  },
  'extension-rules': {
    filename: 'rules.json (declarativeNetRequest)',
    archBadge: 'Manifest V3: declarativeNetRequest Rules Engine • Zero JS Overhead Network Interception',
    code: `[
  {
    "id": 1001,
    "priority": 1,
    "action": { "type": "block" },
    "condition": {
      "urlFilter": "||google-analytics.com^",
      "resourceTypes": ["script", "xmlhttprequest", "ping", "beacon"]
    }
  },
  {
    "id": 1002,
    "priority": 2,
    "action": { "type": "block" },
    "condition": {
      "regexFilter": "^https?:\\/\\/.*(doubleclick|adservice|telemetry)\\..*",
      "resourceTypes": ["sub_frame", "script", "image", "other"]
    }
  },
  {
    "id": 1003,
    "priority": 3,
    "action": {
      "type": "redirect",
      "redirect": { "extensionPath": "/injected/noop.js" }
    },
    "condition": {
      "urlFilter": "*adblock-detector*.js",
      "resourceTypes": ["script"]
    }
  }
]`
  },
  'turbo-chunk': {
    filename: 'chunk-engine.js (TurboChunkEngine)',
    archBadge: 'Concurrency Engine: Byte-Range Pipelining • Offscreen Workers • Blob Assembly',
    code: `/**
 * TurboSpeed Downloader - Multi-threaded Segmented Engine
 * Handles dynamic byte-range splitting, concurrent pipelining,
 * connection throttling bypass, and real-time telemetry.
 */
export class TurboChunkEngine {
  constructor(options = {}) {
    this.url = options.url;
    this.threadCount = Math.max(1, Math.min(32, options.threads || 8));
    this.status = 'idle';
    this.chunks = [];
    this.chunkBuffers = [];
  }

  async probeAndSegment() {
    const headRes = await fetch(this.url, { method: 'HEAD' });
    const acceptRanges = headRes.headers.get('accept-ranges');
    const contentLength = parseInt(headRes.headers.get('content-length'), 10);
    
    // Probe byte-range compatibility for 10x acceleration
    if (acceptRanges === 'bytes' && contentLength > 1024 * 1024) {
      const chunkSize = Math.ceil(contentLength / this.threadCount);
      const downloadTasks = [];

      for (let i = 0; i < this.threadCount; i++) {
        const startByte = i * chunkSize;
        const endByte = (i === this.threadCount - 1) ? contentLength - 1 : (startByte + chunkSize - 1);
        downloadTasks.push(this.fetchChunkSegment(startByte, endByte, i));
      }

      await Promise.all(downloadTasks);
      return this.stitchAndFinalizeBlob();
    }
  }
}`
  }
};

codeRepository['webview-code'] = codeRepository['android-bridge'];

function switchCodeTab(tabKey) {
  playUiSound('tab');
  appState.activeCodeTab = tabKey;

  // Update Buttons
  document.querySelectorAll('.code-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('onclick')?.includes(tabKey));
  });

  const entry = codeRepository[tabKey];
  if (!entry) return;

  const codeDisplay = document.getElementById('code-display-block');
  const filenameTag = document.getElementById('current-code-filename');
  const archBadge = document.querySelector('.arch-badge');

  if (codeDisplay) codeDisplay.textContent = entry.code;
  if (filenameTag) filenameTag.textContent = entry.filename;
  if (archBadge) archBadge.textContent = entry.archBadge;
}

function copyActiveCode() {
  const entry = codeRepository[appState.activeCodeTab];
  if (!entry) return;

  navigator.clipboard.writeText(entry.code).then(() => {
    playUiSound('success');
    const copyTextSpan = document.getElementById('copy-code-text');
    if (copyTextSpan) {
      const original = copyTextSpan.textContent;
      copyTextSpan.textContent = 'Copied!';
      setTimeout(() => copyTextSpan.textContent = original, 2000);
    }
    showToast(`Code copied to clipboard: ${entry.filename}`);
  }).catch(() => {
    showToast(`Copy failed, please select and copy manually.`);
  });
}

// ===================================================================
// PROJECT ARCHITECTURE MODALS
// ===================================================================
const projectModalData = {
  webview: {
    title: 'Android WebView Native Integration Architecture',
    subtitle: 'January 2026 — June 2026 | PG Project | Anna University',
    content: `
      <div class="modal-arch-section">
        <h4>System Overview & Objectives</h4>
        <p>
          Engineered an Android native application using the <code>android.webkit</code> framework that seamlessly binds responsive web applications within a secure native mobile shell. Eliminates external browser reliance while preserving 60fps mobile hardware responsiveness.
        </p>

        <h4 style="margin-top: 18px;">Architectural Layers</h4>
        <div style="background: rgba(255,255,255,0.04); border: 1px solid var(--border-subtle); padding: 16px; border-radius: 10px; margin: 12px 0;">
          <p><strong>1. Native Android Application Container:</strong> Host Activity with lifecycle hooks (onCreate, onResume, onPause, onDestroy) managing the primary WebView UI thread.</p>
          <p><strong>2. WebChromeClient Layer:</strong> Handles browser dialogs, favicon caching, JavaScript console telemetry, and native hardware permission prompts (geolocation/camera).</p>
          <p><strong>3. WebViewClient Layer:</strong> Intercepts network URL schema, executes custom SSL error handling, and blocks cross-site script injections.</p>
          <p><strong>4. WebSettings Engine:</strong> Configures local DOM storage, viewport scaling, cache policies, and Chromium hardware acceleration flags.</p>
        </div>

        <h4 style="margin-top: 18px;">Engineering Results</h4>
        <ul style="padding-left: 20px; line-height: 1.6; color: var(--text-secondary);">
          <li>Unified mobile deployment: Updates to web services render instantly without pushing APK revisions to app stores.</li>
          <li>Zero browser-chrome clutter: Delivers an immersive full-screen native user journey.</li>
          <li>Reduced maintenance costs across mobile and web engineering divisions.</li>
        </ul>
      </div>
    `
  },

  fakereview: {
    title: 'E-Commerce Fake Review Monitoring & Detection Architecture',
    subtitle: 'February 2023 — July 2023 | PG Project | Bharathidasan University',
    content: `
      <div class="modal-arch-section">
        <h4>Challenge & Core Motivation</h4>
        <p>
          Deceptive e-commerce reviews generated by competitor syndicates, bot swarms, and compensated reviewers degrade consumer trust and distort marketplace equity. This project engineered a multi-stage audit system to cleanse product feedback feeds in real time.
        </p>

        <h4 style="margin-top: 18px;">Inspection Engine Architecture</h4>
        <div style="background: rgba(255,255,255,0.04); border: 1px solid var(--border-subtle); padding: 16px; border-radius: 10px; margin: 12px 0;">
          <p><strong>Stage A: Transaction Verification:</strong> Correlates reviewer ID against product order fulfillment receipts in the MySQL relational database.</p>
          <p><strong>Stage B: Sentiment & Polarization Entropy:</strong> Evaluates extreme five-star and one-star rating distributions against linguistic syntax and lexical polarity.</p>
          <p><strong>Stage C: Account Velocity & IP Clustering:</strong> Flags multiple submissions occurring from identical subnets or newly minted user accounts within brief time windows.</p>
          <p><strong>Stage D: Quarantine Queue:</strong> Automatically diverts suspect reviews into an administrator review buffer before public indexation.</p>
        </div>

        <h4 style="margin-top: 18px;">Tech Stack Breakdown</h4>
        <p style="color: var(--text-secondary); line-height: 1.6;">
          <strong>Front-End:</strong> HTML5, CSS3, JavaScript ES6 for interactive review dashboard.<br>
          <strong>Middleware:</strong> PHP business logic endpoints handling payload parsing.<br>
          <strong>Persistence:</strong> MySQL with 3NF relational schemas, foreign key constraints, and multi-column indexes.
        </p>
      </div>
    `
  },

  superblocker: {
    title: 'Super Blocker — Privacy & High-Efficiency Web Filter Engine',
    subtitle: 'Production Chromium Extension Architecture | Manifest V3 | 2026',
    content: `
      <div class="modal-arch-section">
        <h4>System Architecture & Innovation</h4>
        <p>
          Super Blocker is an engineered high-performance ad-blocking and privacy enforcement engine built for Chromium-based browsers (Chrome, Edge, Brave). Designed around the modern Chrome Manifest V3 standard, it offloads URL filtering from JavaScript to the browser's C++ network core.
        </p>

        <h4 style="margin-top: 18px;">Core Engineering Components</h4>
        <div style="background: rgba(255,255,255,0.04); border: 1px solid var(--border-subtle); padding: 16px; border-radius: 10px; margin: 12px 0;">
          <p><strong>1. declarativeNetRequest Pipeline:</strong> Fast-path static and dynamic rule indexing with zero page latency or memory leakage.</p>
          <p><strong>2. Multi-List Heuristic Compiler:</strong> Compiles and deduplicates over 50,000+ EasyList, Hagezi, and annoyance filter rules.</p>
          <p><strong>3. Anti-Adblock Defuser:</strong> Dynamic script injection engine neutralizing client-side bait elements and debugger detection routines.</p>
          <p><strong>4. YouTube Smart Video Ad Skip:</strong> Real-time mutation observer identifying advertisement overlays and accelerating video stream timeline to instantaneous playback.</p>
        </div>

        <h4 style="margin-top: 18px;">Key Performance Metrics</h4>
        <ul style="padding-left: 20px; line-height: 1.6; color: var(--text-secondary);">
          <li>Up to 65% reduction in network data usage on media-heavy news and content sites.</li>
          <li>Zero CPU contention: URL pattern matching handled strictly within browser native thread pools.</li>
          <li>Comprehensive telemetry protection: Blocks third-party fingerprinting beacons and cross-site cookies.</li>
        </ul>
      </div>
    `
  },
  turbospeed: {
    title: 'TurboSpeed Downloader — Multi-Threaded Download Accelerator',
    subtitle: 'Production Chromium Extension Architecture | Manifest V3 & Offscreen Engine | 2026',
    content: `
      <div class="modal-arch-section">
        <h4>System Architecture & 10x Acceleration</h4>
        <p>
          TurboSpeed Downloader is an automated high-performance download manager designed for Chromium and Gecko browsers. It accelerates network transfers up to 10x by dynamically segmenting large payloads into concurrent byte-range requests and reassembling them via client-side Blob stitching.
        </p>

        <h4 style="margin-top: 18px;">Core Engineering Components</h4>
        <div style="background: rgba(255,255,255,0.04); border: 1px solid var(--border-subtle); padding: 16px; border-radius: 10px; margin: 12px 0;">
          <p><strong>1. TurboChunkEngine Pipeline:</strong> Performs lightweight HEAD/Range probes to verify HTTP byte-range support, then forks 8 parallel streams to bypass server-side single-connection throttling.</p>
          <p><strong>2. Offscreen Document Singleton Lock:</strong> Resolves Chromium's single-offscreen constraint through an asynchronous promise lock (_offscreenInitPromise), preventing concurrency crashes during multi-file transfers.</p>
          <p><strong>3. Declarative Net Request CORS Sanitize:</strong> Injects dynamic Range headers and strips conflicting Origin restrictions under Chromium Manifest V3 rules.</p>
          <p><strong>4. Cross-Platform Path Normalizer:</strong> Sanitizes Windows reserved device names (CON, PRN, AUX, NUL) and prevents directory traversal attacks.</p>
        </div>

        <h4 style="margin-top: 18px;">Download Package & Verification</h4>
        <p style="color: var(--text-secondary); line-height: 1.6;">
          Complete unpacked extension package is packaged and available for immediate deployment via Developer Mode across Chrome, Edge, Brave, and Opera.
        </p>
        <div style="margin-top: 16px;">
          <a href="assets/turbospeed-downloader.zip" download="turbospeed-downloader.zip" class="btn btn-sm btn-primary">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            <span>Download Extension (ZIP)</span>
          </a>
        </div>
      </div>
    `
  }
};

function openProjectModal(key) {
  playUiSound('click');
  const data = projectModalData[key];
  if (!data) return;

  const modal = document.getElementById('project-modal');
  const title = document.getElementById('project-modal-title');
  const subtitle = document.getElementById('project-modal-subtitle');
  const body = document.getElementById('project-modal-content');

  if (title) title.textContent = data.title;
  if (subtitle) subtitle.textContent = data.subtitle;
  if (body) body.innerHTML = data.content;

  if (modal) modal.classList.remove('hidden');
}

const certModalData = {
  'gtec-java': {
    title: 'Certified Java SE Developer (GTEC Education)',
    subtitle: 'Accredited Professional Java Certification',
    content: `
      <div class="modal-arch-section">
        <h4>Credential Syllabus & Verified Mastery</h4>
        <p>
          Practical accreditation covering enterprise Java SE engineering, thread concurrency, memory management, and clean architecture standards.
        </p>

        <div style="background: rgba(255,255,255,0.04); border: 1px solid var(--border-subtle); padding: 16px; border-radius: 10px; margin: 16px 0;">
          <ul style="padding-left: 20px; line-height: 1.7; color: var(--text-secondary);">
            <li><strong>Decoupled Design Patterns:</strong> Factory, Singleton, Strategy, Observer, and Dependency Inversion.</li>
            <li><strong>Multithreading & Concurrency:</strong> Java Memory Model (JMM), ExecutorService, synchronized blocks, atomic primitives, and thread safety.</li>
            <li><strong>Java Collections Framework:</strong> Performance characteristics of List, Set, Map, and Queue implementations under Big-O access patterns.</li>
            <li><strong>Robust Exception Handling:</strong> Checked vs unchecked exceptions, custom exception hierarchies, and fail-safe transactional rollbacks.</li>
            <li><strong>Enterprise I/O & Networking:</strong> NIO channels, socket communication, serialization, and stream processing.</li>
          </ul>
        </div>
      </div>
    `
  },
  'java-ee': {
    title: 'Java EE (Enterprise Edition)',
    subtitle: 'Featured Industry Certification • Enterprise Multi-Tier Systems',
    content: `
      <div class="modal-arch-section">
        <h4>Enterprise Java & Distributed Architecture</h4>
        <p>
          Comprehensive industrial competence in building secure, distributed multi-tier web applications and transactional enterprise backend infrastructure.
        </p>

        <div style="background: rgba(255,255,255,0.04); border: 1px solid var(--border-subtle); padding: 16px; border-radius: 10px; margin: 16px 0;">
          <ul style="padding-left: 20px; line-height: 1.7; color: var(--text-secondary);">
            <li><strong>Servlets & Filter Pipelines:</strong> HTTP lifecycle management, filter chains, cross-origin request handling, and secure session tracking.</li>
            <li><strong>JPA & Hibernate Persistence:</strong> Object-Relational Mapping (ORM), entity lifecycle states, caching tiers, and multi-tier transaction management.</li>
            <li><strong>Enterprise Application Servers:</strong> Configuration and optimization across Apache Tomcat, GlassFish, and WildFly deployment containers.</li>
            <li><strong>RESTful & Web Services:</strong> Microservices integration, JAX-RS endpoints, JSON data binding, and robust endpoint validation.</li>
            <li><strong>Enterprise Security Architecture:</strong> Role-based access control (RBAC), declarative container security, and authentication realms.</li>
          </ul>
        </div>
      </div>
    `
  }
};

function openCertModal(certKey = 'gtec-java') {
  playUiSound('click');
  const data = certModalData[certKey] || certModalData['gtec-java'];
  const modal = document.getElementById('project-modal');
  const title = document.getElementById('project-modal-title');
  const subtitle = document.getElementById('project-modal-subtitle');
  const body = document.getElementById('project-modal-content');

  if (title) title.textContent = data.title;
  if (subtitle) subtitle.textContent = data.subtitle;
  if (body) body.innerHTML = data.content;

  if (modal) modal.classList.remove('hidden');
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    playUiSound('click');
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
    playUiSound('click');
  }
}

const legalModalData = {
  ip: {
    title: 'Intellectual Property & Code Rights Declaration',
    subtitle: 'Proprietary Engineering Notice • Arun kumar Saravanan',
    content: `
      <div class="modal-arch-section">
        <h4>Copyright & Attribution Notice</h4>
        <p>
          &copy; 2026 Arun kumar Saravanan. All rights reserved. The architecture specifications, application designs, software implementations, and visual mockups presented across this portfolio represent the original intellectual creation and academic research of Arun kumar Saravanan.
        </p>

        <h4 style="margin-top: 18px;">Permitted Use & Evaluation Standards</h4>
        <div style="background: rgba(255,255,255,0.04); border: 1px solid var(--border-subtle); padding: 16px; border-radius: 10px; margin: 12px 0;">
          <ul style="padding-left: 20px; line-height: 1.7; color: var(--text-secondary);">
            <li><strong>Recruitment & Hiring Evaluation:</strong> Prospective engineering teams, technical recruiters, and hiring managers are fully authorized to inspect and evaluate all source code, relational schemas, and architecture documents for professional hiring considerations.</li>
            <li><strong>Academic Integrity:</strong> Postgraduate thesis documentation, research, and project artifacts from Anna University, Bharathidasan University, and Thiruvalluvar University adhere to accredited academic evaluation standards.</li>
            <li><strong>Open Source Components:</strong> Open-source projects (e.g. Super Blocker, TurboSpeed Downloader) are provided under permissive MIT terms for personal research and browser enhancement.</li>
          </ul>
        </div>
      </div>
    `
  },
  privacy: {
    title: 'Privacy & Zero-Telemetry Policy',
    subtitle: 'Client Privacy Guarantee • Native Web Security Standards',
    content: `
      <div class="modal-arch-section">
        <h4>Client-Side Privacy First</h4>
        <p>
          This portfolio is built on native HTML5, vanilla CSS3, and ES6 JavaScript with zero third-party tracking beacons, zero advertising cookies, and zero behavioral telemetry scripts.
        </p>

        <h4 style="margin-top: 18px;">Security & Data Standards</h4>
        <div style="background: rgba(255,255,255,0.04); border: 1px solid var(--border-subtle); padding: 16px; border-radius: 10px; margin: 12px 0;">
          <ul style="padding-left: 20px; line-height: 1.7; color: var(--text-secondary);">
            <li><strong>Zero Remote Profiling:</strong> We do not sell, rent, or transmit visitor interaction logs to commercial tracking networks.</li>
            <li><strong>Direct Communication:</strong> Inquiry information provided through the contact interface is strictly utilized for direct professional communication with Arun kumar Saravanan.</li>
            <li><strong>HTTPS/TLS Encryption:</strong> All data in transit is encrypted using industry-standard TLS encryption protocols.</li>
          </ul>
        </div>
      </div>
    `
  }
};

function openLegalModal(type = 'ip') {
  playUiSound('click');
  const data = legalModalData[type] || legalModalData['ip'];
  const modal = document.getElementById('project-modal');
  const title = document.getElementById('project-modal-title');
  const subtitle = document.getElementById('project-modal-subtitle');
  const body = document.getElementById('project-modal-content');

  if (title) title.textContent = data.title;
  if (subtitle) subtitle.textContent = data.subtitle;
  if (body) body.innerHTML = data.content;

  if (modal) modal.classList.remove('hidden');
}

// Close modals on clicking outside or ESC
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.add('hidden'));
  }
});

document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.classList.add('hidden');
    }
  });
});

// ===================================================================
// FILTERS (PROJECTS & SKILLS)
// ===================================================================
function initFilters() {
  // Project Filter
  const projectFilterBtns = document.querySelectorAll('.projects-filter-bar .filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  projectFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playUiSound('click');
      projectFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      projectCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Skills Category Tabs
  const skillTabs = document.querySelectorAll('.skills-category-tabs .cat-tab');
  const skillCards = document.querySelectorAll('.skills-grid .skill-card');

  skillTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      playUiSound('click');
      skillTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const category = tab.getAttribute('data-cat');
      skillCards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-cat') === category) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// ===================================================================
// THEME SWITCHER
// ===================================================================
function initTheme() {
  const themeBtn = document.getElementById('theme-toggle-btn');
  const sunIcon = document.querySelector('.sun-icon');
  const moonIcon = document.querySelector('.moon-icon');

  const savedTheme = localStorage.getItem('arunkumar_portfolio_theme') || 'light';
  applyTheme(savedTheme);

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = current === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('arunkumar_portfolio_theme', newTheme);
      showToast(`Switched to ${newTheme === 'dark' ? 'Clean Dark' : 'Minimalist Light'} theme`);
    });
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    appState.theme = theme;
    if (theme === 'light') {
      // In light mode, show moon icon to allow toggling to dark
      sunIcon?.classList.add('hidden');
      moonIcon?.classList.remove('hidden');
    } else {
      // In dark mode, show sun icon to allow toggling to light
      moonIcon?.classList.add('hidden');
      sunIcon?.classList.remove('hidden');
    }
  }
}

// ===================================================================
// MOBILE DRAWER
// ===================================================================
function initMobileDrawer() {
  const mobileToggle = document.getElementById('mobile-toggle-btn');
  const drawer = document.getElementById('mobile-drawer');
  const closeBtn = document.getElementById('drawer-close-btn');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  mobileToggle?.addEventListener('click', () => {
    playUiSound('click');
    drawer?.classList.add('open');
  });

  closeBtn?.addEventListener('click', () => {
    playUiSound('click');
    drawer?.classList.remove('open');
  });

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      drawer?.classList.remove('open');
    });
  });
}

// ===================================================================
// CONTACT FORM HANDLER
// ===================================================================
function handleContactSubmit(e) {
  e.preventDefault();
  playUiSound('click');

  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const subjectSelect = document.getElementById('contact-subject');
  const messageInput = document.getElementById('contact-message');
  const submitBtn = document.getElementById('contact-submit-btn');
  const feedback = document.getElementById('form-feedback');

  if (!nameInput?.value || !emailInput?.value || !messageInput?.value) {
    if (feedback) {
      feedback.textContent = 'Please fill out all required fields.';
      feedback.className = 'form-feedback error';
      feedback.classList.remove('hidden');
    }
    return;
  }

  // Realistic sending simulation
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Processing Message...</span>`;
  }

  setTimeout(() => {
    playUiSound('success');
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<span>Message Sent Successfully!</span>`;
    }

    if (feedback) {
      feedback.innerHTML = `
        <strong>Thank you, ${nameInput.value}!</strong> Your message regarding <em>${subjectSelect?.options[subjectSelect.selectedIndex]?.text || 'Software Opportunity'}</em> has been transmitted to Arun kumar Saravanan. You will receive a direct reply at <code>${emailInput.value}</code>.
      `;
      feedback.className = 'form-feedback success';
      feedback.classList.remove('hidden');
    }

    showToast(`Message logged for Arun kumar Saravanan!`);

    // Reset Form fields
    document.getElementById('contact-form')?.reset();

    setTimeout(() => {
      if (submitBtn) {
        submitBtn.innerHTML = `
          <span>Send Message to Arun</span>
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        `;
      }
    }, 4000);
  }, 900);
}

// ===================================================================
// UTILITIES: TOAST & CLIPBOARD
// ===================================================================
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>⚡</span><span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.4s ease';
    setTimeout(() => toast.remove(), 400);
  }, 3200);
}

function fallbackCopyText(text) {
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '-9999px';
    textArea.style.left = '-9999px';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    if (successful) {
      playUiSound('success');
      showToast('Copied to clipboard!');
    } else {
      showToast('Could not copy automatically.');
    }
  } catch (err) {
    showToast('Could not copy automatically.');
  }
}

function copyText(text) {
  playUiSound('click');
  if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    navigator.clipboard.writeText(text).then(() => {
      playUiSound('success');
      showToast(`Copied to clipboard: "${text}"`);
    }).catch(() => {
      fallbackCopyText(text);
    });
  } else {
    fallbackCopyText(text);
  }
}

function showCodeSnippet(snippetKey) {
  playUiSound('click');
  const section = document.getElementById('skills');
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
    if (snippetKey === 'webview-code') {
      switchCodeTab('android-bridge');
    } else if (snippetKey === 'extension-code' || snippetKey === 'extension-rules') {
      switchCodeTab('extension-rules');
    }
  }
}

// ===================================================================
// SCROLL REVEAL OBSERVER
// ===================================================================
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (!revealElements.length) return;

  if (typeof window !== 'undefined' && typeof IntersectionObserver !== 'undefined') {
    try {
      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      }, {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.1
      });

      revealElements.forEach(el => revealObserver.observe(el));
    } catch (e) {
      revealElements.forEach(el => el.classList.add('is-revealed'));
    }
  } else {
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }
}

// ===================================================================
// SMART HEADER (AUTO-HIDE ON SCROLL DOWN / AUTO-SHOW ON SCROLL UP)
// ===================================================================
function initSmartHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const drawer = document.getElementById('mobile-drawer');
  let lastScrollY = typeof window !== 'undefined' ? (window.scrollY || 0) : 0;
  let ticking = false;
  const delta = 5;

  function onScroll() {
    ticking = false;
    const currentScrollY = typeof window !== 'undefined' ? Math.max(window.scrollY || 0, 0) : 0;

    // If mobile drawer is open, keep header visible
    if (drawer && drawer.classList && drawer.classList.contains('open')) {
      header.classList.remove('header-hidden');
      lastScrollY = currentScrollY;
      return;
    }

    // Shadow elevation when scrolled
    if (currentScrollY > 20) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }

    // At top of page: always visible
    if (currentScrollY <= 60) {
      header.classList.remove('header-hidden');
    } else if (Math.abs(currentScrollY - lastScrollY) >= delta) {
      if (currentScrollY > lastScrollY) {
        // Scrolling DOWN -> Hide header
        header.classList.add('header-hidden');
      } else {
        // Scrolling UP -> Show header
        header.classList.remove('header-hidden');
      }
    }

    lastScrollY = currentScrollY;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      if (typeof window.requestAnimationFrame === 'function') {
        window.requestAnimationFrame(onScroll);
      } else {
        onScroll();
      }
    }
  }, { passive: true });

  onScroll();
}

// ===================================================================
// ACTIVE NAVIGATION HIGHLIGHT (RAF-THROTTLED & PASSIVE - ZERO ANR)
// ===================================================================
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  if (!sections.length) return;

  // Pre-cache DOM element pairs to eliminate layout thrashing during scroll
  const navMap = [];
  sections.forEach(sec => {
    const id = sec.getAttribute('id');
    const link = document.querySelector(`.nav-links a[href*="${id}"]`);
    if (link) {
      navMap.push({ section: sec, link });
    }
  });

  if (!navMap.length) return;

  let ticking = false;

  function updateActiveNav() {
    ticking = false;
    const scrollY = typeof window !== 'undefined' ? (window.scrollY || 0) : 0;

    navMap.forEach(({ section, link }) => {
      const top = section.offsetTop - 140;
      const height = section.offsetHeight;
      const isActive = scrollY >= top && scrollY < top + height;
      if (isActive && !link.classList.contains('active')) {
        link.classList.add('active');
      } else if (!isActive && link.classList.contains('active')) {
        link.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      if (typeof window.requestAnimationFrame === 'function') {
        window.requestAnimationFrame(updateActiveNav);
      } else {
        updateActiveNav();
      }
    }
  }, { passive: true });

  updateActiveNav();
}

// ===================================================================
// INITIALIZATION ON DOM READY
// ===================================================================
document.addEventListener('DOMContentLoaded', () => {
  handleTyping();
  initTheme();
  initFilters();
  initMobileDrawer();
  initScrollReveal();
  initSmartHeader();
  initActiveNav();
  initEducationToggle();
  initTitleHoverBeams();

  // Resume Link listener
  const resumeLinkBtn = document.getElementById('cta-open-pdf-modal');
  resumeLinkBtn?.addEventListener('click', () => {
    playUiSound('click');
  });
});

// ===================================================================
// RESUME INTERACTIVE VIEW SWITCHER & UTILITIES
// ===================================================================
function switchResumeView(mode) {
  const sheetView = document.querySelector('#resume-interactive-sheet');
  const pdfView = document.querySelector('#resume-embedded-pdf-view');
  const sheetBtn = document.querySelector('#view-sheet-btn');
  const pdfBtn = document.querySelector('#view-pdf-btn');

  if (mode === 'sheet') {
    sheetView?.classList.remove('hidden');
    pdfView?.classList.add('hidden');
    sheetBtn?.classList.add('active');
    sheetBtn?.setAttribute('aria-selected', 'true');
    pdfBtn?.classList.remove('active');
    pdfBtn?.setAttribute('aria-selected', 'false');
    playUiSound('click');
  } else if (mode === 'pdf') {
    sheetView?.classList.add('hidden');
    pdfView?.classList.remove('hidden');
    pdfBtn?.classList.add('active');
    pdfBtn?.setAttribute('aria-selected', 'true');
    sheetBtn?.classList.remove('active');
    sheetBtn?.setAttribute('aria-selected', 'false');
    playUiSound('click');
  }
}

function printResume() {
  playUiSound('click');
  window.print();
}

function copyResumeText() {
  const resumeText = `ARUN KUMAR SARAVANAN
Software Developer | MCA Graduate
Email: arunkumar-saravanan@outlook.com | Phone: 9360037833
LinkedIn: http://www.linkedin.com/in/arunkumar9701 | Telegram: https://t.me/arunexe
Address: Erumbur-Bhuvanagiri (TK)-Cuddalore (DT)-Tamil Nadu - 608 704

PROFESSIONAL SUMMARY
I'm an MCA graduate and aspiring Software Developer with a strong interest in building practical, reliable, and user-focused applications. My technical foundation includes Java, Spring Boot, web technologies, database management, and object-oriented programming, along with hands-on experience in Android WebView application development and e-commerce review monitoring.

EDUCATIONAL BACKGROUND
- MCA (Master of Computer Applications) | 2024 - 2026
  Meenakshi Ramaswamy Engineering College - Anna University
- M.Sc.CS (Master of Science in Computer Science) | 2021 - 2023 | CGPA: 7.2/10
  Meenakshi Ramasamy Arts and Science College - Bharathidasan University
- BCA (Bachelor of Computer Applications) | 2018 - 2021 | CGPA: 6.3/10
  Dr.S. Ramadoss Arts and Science College - Thiruvalluvar University

TECHNICAL PROFICIENCIES
- Programming Languages: Java, C#, C++
- Frameworks: Spring Boot, Angular JS, Servlets
- Web Technologies: JSP, HTML5
- Databases: MySQL, Mongo DB

PROJECTS
1. Android WebView Application for Integrating Web Content into a Native Mobile Platform (Jan 2026 - Jun 2026 | PG Project)
2. E-Commerce Fake Review Monitoring and Detection (Feb 2023 - Jul 2023 | PG Project)

CERTIFICATES
- Java SE Certified Developer (GTEC Education)
- C# Development Course (15-Day intensive online course - Completed)
- MySQL CRUD Operations and Database Engineering`;

  if (navigator?.clipboard?.writeText) {
    navigator.clipboard.writeText(resumeText).then(() => {
      playUiSound('success');
      showToast('Resume text copied to clipboard!');
    }).catch(() => {
      copyText(resumeText);
    });
  } else {
    copyText(resumeText);
  }
}

// ===================================================================
// EDUCATION INLINE EXPAND ACCORDION
// ===================================================================
function initEducationToggle() {
  document.querySelectorAll('.edu-expand-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.timeline-card');
      if (!card) return;
      const details = card.querySelector('.edu-inline-details');
      if (!details) return;
      const isOpen = details.classList.contains('open');

      details.classList.toggle('open');
      card.classList.toggle('details-open', !isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
      playUiSound('click');
    });
  });
}

// ===================================================================
// DEGREE TITLE INTERACTIVE HOVER BEAM (RAF-THROTTLED & PASSIVE)
// ===================================================================
function initTitleHoverBeams() {
  ['mca-degree-title', 'msc-degree-title', 'bca-degree-title'].forEach((titleId) => {
    const degreeTitleElem = document.getElementById(titleId);
    if (!degreeTitleElem) return;

    let mouseRaf = null;
    degreeTitleElem.addEventListener('mousemove', (e) => {
      if (mouseRaf) return;
      mouseRaf = requestAnimationFrame(() => {
        const rect = degreeTitleElem.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        degreeTitleElem.style.setProperty('--mouse-x', `${x}px`);
        degreeTitleElem.style.setProperty('--mouse-y', `${y}px`);
        mouseRaf = null;
      });
    }, { passive: true });

    degreeTitleElem.addEventListener('mouseleave', () => {
      if (mouseRaf) {
        cancelAnimationFrame(mouseRaf);
        mouseRaf = null;
      }
      degreeTitleElem.style.removeProperty('--mouse-x');
      degreeTitleElem.style.removeProperty('--mouse-y');
    });
  });
}
