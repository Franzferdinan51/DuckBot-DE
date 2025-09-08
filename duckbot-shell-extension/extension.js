/* DuckBot AI Desktop Extension - Main Extension File */

const { GObject, St, Clutter, Gio, GLib } = imports.gi;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const ExtensionUtils = imports.misc.extensionUtils;

const Me = ExtensionUtils.getCurrentExtension();

let duckbotPanel = null;
let aiService = null;
let voiceControl = null;
let memoryManager = null;

// AI Panel Button in Top Bar
var DuckBotPanel = GObject.registerClass(
class DuckBotPanel extends PanelMenu.Button {
    _init() {
        super._init(0.0, 'DuckBot AI Assistant', false);
        
        // Create DuckBot icon
        this._icon = new St.Icon({
            icon_name: 'face-smile-symbolic',
            style_class: 'system-status-icon duckbot-icon',
        });
        
        this.add_child(this._icon);
        
        // AI Status indicator
        this._statusLabel = new St.Label({
            text: 'AI Ready',
            style_class: 'duckbot-status',
            y_align: Clutter.ActorAlign.CENTER,
        });
        this.add_child(this._statusLabel);
        
        this._buildMenu();
        this._initializeAI();
    }
    
    _buildMenu() {
        // Voice Control Section
        let voiceSection = new PopupMenu.PopupMenuSection();
        this.menu.addMenuItem(voiceSection);
        
        this._voiceToggle = new PopupMenu.PopupSwitchMenuItem('Voice Control', false);
        this._voiceToggle.connect('toggled', this._onVoiceToggled.bind(this));
        voiceSection.addMenuItem(this._voiceToggle);
        
        // AI Commands Section
        this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
        
        let aiSection = new PopupMenu.PopupMenuSection();
        this.menu.addMenuItem(aiSection);
        
        let organizeWindows = new PopupMenu.PopupMenuItem('Organize Windows');
        organizeWindows.connect('activate', () => this._executeAICommand('organize-windows'));
        aiSection.addMenuItem(organizeWindows);
        
        let smartSearch = new PopupMenu.PopupMenuItem('Smart Search');
        smartSearch.connect('activate', () => this._executeAICommand('smart-search'));
        aiSection.addMenuItem(smartSearch);
        
        let contextAnalysis = new PopupMenu.PopupMenuItem('Analyze Current Context');
        contextAnalysis.connect('activate', () => this._executeAICommand('analyze-context'));
        aiSection.addMenuItem(contextAnalysis);
        
        // Memory & Learning Section
        this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
        
        let memorySection = new PopupMenu.PopupMenuSection();
        this.menu.addMenuItem(memorySection);
        
        let memoryBrowser = new PopupMenu.PopupMenuItem('Browse Memory');
        memoryBrowser.connect('activate', () => this._openMemoryBrowser());
        memorySection.addMenuItem(memoryBrowser);
        
        let learnPattern = new PopupMenu.PopupMenuItem('Learn Current Workflow');
        learnPattern.connect('activate', () => this._learnWorkflow());
        memorySection.addMenuItem(learnPattern);
        
        // Settings
        this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
        
        let settings = new PopupMenu.PopupMenuItem('DuckBot Settings');
        settings.connect('activate', () => this._openSettings());
        this.menu.addMenuItem(settings);
    }
    
    async _initializeAI() {
        try {
            // Initialize AI services
            this._updateStatus('Initializing AI...', 'orange');
            
            // Connect to DuckBot AI service
            await this._connectToAIService();
            
            // Initialize voice control
            await this._initializeVoice();
            
            // Initialize memory manager
            await this._initializeMemory();
            
            // Set up desktop monitoring
            this._setupDesktopMonitoring();
            
            this._updateStatus('AI Ready', 'green');
            
        } catch (error) {
            log(`DuckBot AI initialization failed: ${error}`);
            this._updateStatus('AI Error', 'red');
        }
    }
    
    async _connectToAIService() {
        // Connect to DuckBot core AI service via D-Bus or local socket
        // This would connect to the main DuckBot Python services
        
        // Placeholder for actual AI service connection
        return new Promise((resolve) => {
            GLib.timeout_add(GLib.PRIORITY_DEFAULT, 1000, () => {
                log('DuckBot AI service connected');
                resolve();
                return GLib.SOURCE_REMOVE;
            });
        });
    }
    
    async _initializeVoice() {
        // Initialize voice control system
        // Would integrate with speech recognition
        log('Voice control initialized');
    }
    
    async _initializeMemory() {
        // Connect to Memento memory system
        log('Memory manager initialized');
    }
    
    _setupDesktopMonitoring() {
        // Monitor desktop events for AI analysis
        // Window focus changes, app launches, file operations, etc.
        
        // Monitor window changes
        global.display.connect('window-created', this._onWindowCreated.bind(this));
        global.display.connect('window-focus-changed', this._onWindowFocusChanged.bind(this));
        
        // Monitor workspace changes  
        global.workspace_manager.connect('active-workspace-changed', 
                                       this._onWorkspaceChanged.bind(this));
    }
    
    _onWindowCreated(display, window) {
        // AI analyzes new window for context
        let appName = window.get_wm_class();
        log(`AI analyzing new window: ${appName}`);
        
        // Send to AI for context learning
        this._sendToAI('window-created', { app: appName, time: Date.now() });
    }
    
    _onWindowFocusChanged(display) {
        let focusedWindow = display.get_focus_window();
        if (focusedWindow) {
            let appName = focusedWindow.get_wm_class();
            log(`AI tracking focus change: ${appName}`);
            
            // Update AI context
            this._sendToAI('focus-changed', { app: appName, time: Date.now() });
        }
    }
    
    _onWorkspaceChanged(manager, from, to) {
        log(`AI tracking workspace change: ${from} -> ${to}`);
        this._sendToAI('workspace-changed', { from: from, to: to, time: Date.now() });
    }
    
    _onVoiceToggled(item, state) {
        if (state) {
            this._enableVoiceControl();
            this._updateStatus('Listening...', 'blue');
        } else {
            this._disableVoiceControl();
            this._updateStatus('AI Ready', 'green');
        }
    }
    
    _enableVoiceControl() {
        log('Voice control enabled');
        // Start listening for voice commands
        // Would integrate with speech recognition service
    }
    
    _disableVoiceControl() {
        log('Voice control disabled');
        // Stop listening
    }
    
    async _executeAICommand(command) {
        this._updateStatus('Processing...', 'blue');
        
        try {
            switch (command) {
                case 'organize-windows':
                    await this._organizeWindows();
                    break;
                case 'smart-search':
                    this._openSmartSearch();
                    break;
                case 'analyze-context':
                    await this._analyzeCurrentContext();
                    break;
            }
            
            this._updateStatus('AI Ready', 'green');
        } catch (error) {
            log(`AI command failed: ${error}`);
            this._updateStatus('AI Error', 'red');
        }
    }
    
    async _organizeWindows() {
        // AI-powered window organization
        let windows = global.get_window_actors();
        
        // Analyze current workspace and arrange windows intelligently
        log(`Organizing ${windows.length} windows with AI`);
        
        // This would call the AI service to determine optimal layout
        await this._sendToAI('organize-windows', { 
            workspace: global.workspace_manager.get_active_workspace_index(),
            windows: windows.length 
        });
        
        // Apply AI-suggested window arrangement
        this._applyIntelligentLayout(windows);
    }
    
    _applyIntelligentLayout(windows) {
        // Apply AI-suggested window layout
        // This would implement smart tiling, grouping related windows, etc.
        
        let workArea = Main.layoutManager.getWorkAreaForMonitor(0);
        let numWindows = windows.length;
        
        if (numWindows === 2) {
            // Side-by-side for 2 windows
            windows[0].get_meta_window().move_resize_frame(false,
                workArea.x, workArea.y, workArea.width / 2, workArea.height);
            windows[1].get_meta_window().move_resize_frame(false,
                workArea.x + workArea.width / 2, workArea.y, workArea.width / 2, workArea.height);
        } else if (numWindows === 3) {
            // Smart 3-window layout
            // Main window on left, two smaller on right
            windows[0].get_meta_window().move_resize_frame(false,
                workArea.x, workArea.y, workArea.width * 0.6, workArea.height);
            windows[1].get_meta_window().move_resize_frame(false,
                workArea.x + workArea.width * 0.6, workArea.y, workArea.width * 0.4, workArea.height / 2);
            windows[2].get_meta_window().move_resize_frame(false,
                workArea.x + workArea.width * 0.6, workArea.y + workArea.height / 2, workArea.width * 0.4, workArea.height / 2);
        }
        
        log('Applied intelligent window layout');
    }
    
    _openSmartSearch() {
        // Open AI-enhanced search interface
        log('Opening smart search');
        
        // This would launch a custom search interface with AI capabilities
        GLib.spawn_command_line_async('duckbot-search --ai-enhanced');
    }
    
    async _analyzeCurrentContext() {
        // AI analyzes current desktop context
        let context = {
            focusedApp: global.display.get_focus_window()?.get_wm_class(),
            workspace: global.workspace_manager.get_active_workspace_index(),
            time: Date.now(),
            windowCount: global.get_window_actors().length
        };
        
        log('Analyzing current context with AI');
        await this._sendToAI('analyze-context', context);
        
        // Show context analysis results
        Main.notify('DuckBot AI', 'Context analysis complete. Check memory for insights.');
    }
    
    _openMemoryBrowser() {
        // Open Memento memory browser
        log('Opening memory browser');
        GLib.spawn_command_line_async('duckbot-memory-browser');
    }
    
    _learnWorkflow() {
        // Learn current workflow pattern
        log('Learning current workflow');
        Main.notify('DuckBot AI', 'Learning your current workflow. Continue working normally.');
        
        // Start learning mode
        this._sendToAI('start-learning', { timestamp: Date.now() });
    }
    
    _openSettings() {
        // Open DuckBot settings
        GLib.spawn_command_line_async('duckbot-settings');
    }
    
    async _sendToAI(action, data) {
        // Send data to AI service for processing
        // This would connect to the DuckBot Python AI services
        
        log(`Sending to AI: ${action} with data: ${JSON.stringify(data)}`);
        
        // Placeholder - would use D-Bus or socket connection
        return new Promise((resolve) => {
            GLib.timeout_add(GLib.PRIORITY_DEFAULT, 500, () => {
                resolve({ success: true });
                return GLib.SOURCE_REMOVE;
            });
        });
    }
    
    _updateStatus(text, color) {
        this._statusLabel.set_text(text);
        
        // Update icon color based on status
        switch (color) {
            case 'green':
                this._icon.set_icon_name('face-smile-symbolic');
                break;
            case 'blue':
                this._icon.set_icon_name('face-cool-symbolic');
                break;
            case 'orange':
                this._icon.set_icon_name('face-uncertain-symbolic');
                break;
            case 'red':
                this._icon.set_icon_name('face-sad-symbolic');
                break;
        }
    }
    
    destroy() {
        // Cleanup
        super.destroy();
    }
});

// Extension lifecycle
function init() {
    log('DuckBot AI Desktop Extension initializing');
    return new Extension();
}

class Extension {
    enable() {
        log('DuckBot AI Desktop Extension enabled');
        
        // Create AI panel
        duckbotPanel = new DuckBotPanel();
        Main.panel.addToStatusArea('duckbot-ai', duckbotPanel, 0, 'right');
        
        // Initialize AI services bridge
        this._initializeAIBridge();
        
        // Set up global key bindings
        this._setupKeybindings();
    }
    
    disable() {
        log('DuckBot AI Desktop Extension disabled');
        
        if (duckbotPanel) {
            duckbotPanel.destroy();
            duckbotPanel = null;
        }
        
        // Cleanup AI services
        this._cleanupAIBridge();
        
        // Remove keybindings
        this._removeKeybindings();
    }
    
    _initializeAIBridge() {
        // Initialize bridge to DuckBot AI services
        log('Initializing AI bridge');
    }
    
    _cleanupAIBridge() {
        // Cleanup AI service connections
        log('Cleaning up AI bridge');
    }
    
    _setupKeybindings() {
        // Set up global keyboard shortcuts
        // Super+Space for AI assistant, Super+V for voice, etc.
        log('Setting up AI keybindings');
    }
    
    _removeKeybindings() {
        // Remove keyboard shortcuts
        log('Removing AI keybindings');
    }
}