class SearchLogsController < ApplicationController
  #before_filter :check_hostname, :except => :index
  
  def trends
    unless request.format.html?      
      @result  = SearchLog.trends_cache
      respond_to do |format|
        format.json  { render :json => @result, :callback => params[:callback] }
      end
    end
  end
  
  def trend_query
    render :text => 'no valid input' and return if params[:query].blank?
    
    unless request.format.html?
      @result = SearchLog.trend_query_cache(params[:query], params[:date])
      respond_to do |format|
        format.json  { render :json => @result, :callback => params[:callback] }
      end
    end
  end
  
  def trend_lang
    render :text => 'no valid input' and return if params[:query].blank?
    
    unless request.format.html?
      @result = SearchLog.trend_lang_cache(params[:query], params[:date])
      respond_to do |format|
        format.json  { render :json => @result, :callback => params[:callback] }
      end
    end
  end
  
  
  # GET /search_logs
  # GET /search_logs.xml
  def index
    @search_logs = SearchLog.order('created_at DESC').limit(50)

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @search_logs }
    end
  end

  # GET /search_logs/1
  # GET /search_logs/1.xml
  def show
    @search_log = SearchLog.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @search_log }
    end
  end

  # GET /search_logs/new
  # GET /search_logs/new.xml
  def new
    @search_log = SearchLog.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @search_log }
    end
  end

  # GET /search_logs/1/edit
  def edit
    @search_log = SearchLog.find(params[:id])
  end

  def add
    @search_log = SearchLog.new
    @search_log.query = params[:search_log][:query]
    @search_log.messed_query = params[:search_log][:messed_query]

    respond_to do |format|
      if @search_log.save
        format.html { redirect_to(@search_log, :notice => 'Search log was successfully created.') }
        format.xml  { render :xml => @search_log, :status => :created, :location => @search_log }
        format.json { render :json => 'ok' }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @search_log.errors, :status => :unprocessable_entity }
        format.json { render :json => 'fail' }
      end
    end
  end
  
  # POST /search_logs
  # POST /search_logs.xml
  def create
    @search_log = SearchLog.new(params[:search_log])

    respond_to do |format|
      if @search_log.save
        format.html { redirect_to(@search_log, :notice => 'Search log was successfully created.') }
        format.xml  { render :xml => @search_log, :status => :created, :location => @search_log }
        format.json { render :json => 'ok' }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @search_log.errors, :status => :unprocessable_entity }
        format.json { render :json => 'fail' }
      end
    end
  end

  # PUT /search_logs/1
  # PUT /search_logs/1.xml
  def update
    @search_log = SearchLog.find(params[:id])

    respond_to do |format|
      if @search_log.update_attributes(params[:search_log])
        format.html { redirect_to(@search_log, :notice => 'Search log was successfully updated.') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @search_log.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /search_logs/1
  # DELETE /search_logs/1.xml
  def destroy
    @search_log = SearchLog.find(params[:id])
    @search_log.destroy

    respond_to do |format|
      format.html { redirect_to(search_logs_url) }
      format.xml  { head :ok }
    end
  end
  
  def check_hostname
    render :json => 'fail' if request.host =~ /#{SEARCH_SITE}/
  end
end
